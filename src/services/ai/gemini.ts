import 'server-only'

/**
 * gemini.ts — Gemini Flash implementation of the AI provider interface.
 *
 * The project handles all AI traffic through this file. Feature code never
 * calls the Gemini SDK directly; it only imports the abstraction in ai/index.ts.
 */

import { GoogleGenAI } from '@google/genai'
import { z } from 'zod'
import type { GenerateOptions, GenerateResult } from './index'

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-3.8-flash'
const MAX_RETRIES = 1
const BASE_BACKOFF_MS = 500

function getGeminiClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY

  if (!apiKey) {
    throw new GeminiError(
      'AI is not configured yet. Add GEMINI_API_KEY to your local environment.',
      { status: 500 }
    )
  }

  return new GoogleGenAI({ apiKey })
}

function jsonSchemaToZod(schema: unknown): z.ZodTypeAny {
  if (!schema || typeof schema !== 'object') {
    return z.any()
  }

  const schemaObj = schema as Record<string, unknown>

  if (schemaObj.enum && Array.isArray(schemaObj.enum)) {
    return z.enum(schemaObj.enum as [string, ...string[]])
  }

  if (schemaObj.type === 'object' && schemaObj.properties && typeof schemaObj.properties === 'object') {
    const properties = Object.entries(schemaObj.properties as Record<string, unknown>).reduce(
      (acc, [key, value]) => {
        acc[key] = jsonSchemaToZod(value)
        return acc
      },
      {} as Record<string, z.ZodTypeAny>
    )

    const objectSchema = z.object(properties)
    return schemaObj.required && Array.isArray(schemaObj.required)
      ? objectSchema.refine((value) => {
          const keys = schemaObj.required as string[]
          return keys.every((key) => key in value)
        }, 'Missing required JSON fields.')
      : objectSchema
  }

  if (schemaObj.type === 'array') {
    return z.array(jsonSchemaToZod(schemaObj.items ?? z.any()))
  }

  if (schemaObj.type === 'boolean') return z.boolean()
  if (schemaObj.type === 'number' || schemaObj.type === 'integer') return z.number()
  if (schemaObj.type === 'string') return z.string()
  if (schemaObj.type === 'null') return z.null()

  return z.any()
}

export class GeminiError extends Error {
  readonly status?: number
  readonly cause?: unknown

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message)
    this.name = 'GeminiError'
    this.status = options?.status
    this.cause = options?.cause
  }
}

async function withRetry<T>(fn: () => Promise<T>, retries: number = MAX_RETRIES): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      const status = error instanceof GeminiError
        ? error.status
        : typeof error === 'object' && error !== null && 'status' in error
          ? Number(error.status)
          : undefined
      const isRetryable = status === 429 || status === 503

      if (!isRetryable || attempt === retries) {
        if (isRetryable && !(error instanceof GeminiError)) {
          throw new GeminiError('AI is busy, try again.', { status, cause: error })
        }
        throw error
      }

      const delay = BASE_BACKOFF_MS * 2 ** attempt
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  throw lastError
}

export async function generateWithGemini(
  options: GenerateOptions
): Promise<GenerateResult> {
  const client = getGeminiClient()

  return withRetry(async () => {
    const contents = options.messages.map((message) => ({
      role: message.role === 'user' ? 'user' : 'model',
      parts: [{ text: message.content }],
    }))

    const config = {
      temperature: options.temperature ?? 0.7,
      ...(options.system ? { systemInstruction: options.system } : {}),
      ...(options.schema
        ? {
            responseMimeType: 'application/json',
            responseSchema: options.schema,
          }
        : {}),
    }

    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents,
      config,
    })

    const rawText = response?.text ?? ''

    if (!rawText.trim()) {
      throw new GeminiError('AI returned an empty response. Please try again.', {
        status: 500,
      })
    }

    if (options.schema) {
      try {
        const parsed = JSON.parse(rawText)
        const schemaValidator = jsonSchemaToZod(options.schema)
        const validated = schemaValidator.parse(parsed)

        return {
          text: rawText,
          parsed: validated,
        }
      } catch (error) {
        const cause = error instanceof Error ? error : new Error('Invalid AI JSON payload')
        throw new GeminiError('AI is busy, try again.', {
          status: 429,
          cause,
        })
      }
    }

    return { text: rawText }
  }).catch((error) => {
    if (error instanceof GeminiError) {
      throw error
    }

    const status =
      typeof error === 'object' && error && 'status' in error
        ? Number((error as { status?: number }).status)
        : undefined

    throw new GeminiError('AI is busy, try again.', {
      status: status && Number.isFinite(status) ? status : 503,
      cause: error,
    })
  })
}

export async function transcribeWithGemini(audioBlob: Blob): Promise<string> {
  const client = getGeminiClient()

  if (!audioBlob || audioBlob.size === 0) {
    return ''
  }

  if (audioBlob.size > 1_000_000) {
    throw new GeminiError('Recording is too large. Please keep the clip under 1 MB.', {
      status: 413,
    })
  }

  const mimeType = audioBlob.type || 'audio/webm'
  const data = Buffer.from(await audioBlob.arrayBuffer()).toString('base64')

  return withRetry(async () => {
    const response = await client.models.generateContent({
      model: process.env.GEMINI_MODEL || DEFAULT_MODEL,
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: 'Transcribe the audio. Return only the spoken text and keep the formatting clean.',
            },
            {
              inlineData: {
                mimeType,
                data,
              },
            },
          ],
        },
      ],
    })

    return (response?.text || '').trim()
  }).catch((error) => {
    if (error instanceof GeminiError) {
      throw error
    }

    throw new GeminiError('AI transcription is temporarily unavailable. Please try again.', {
      status: 503,
      cause: error,
    })
  })
}
