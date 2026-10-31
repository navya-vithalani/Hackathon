/**
 * gemini.ts — Gemini Flash implementation of the AI provider interface.
 *
 * Only this file knows about the Gemini API. To swap the AI provider,
 * replace this file and update the imports in ai/index.ts.
 *
 * Key behaviors:
 *  - Uses model 'gemini-2.0-flash-exp' for both generation and transcription.
 *  - Retries up to MAX_RETRIES times with exponential backoff on HTTP 429.
 *  - Validates structured output against the caller's JSON Schema;
 *    retries once on invalid JSON before throwing.
 *  - Throws GeminiError with a user-friendly message on unrecoverable errors.
 *
 * Environment:
 *   GEMINI_API_KEY — Google AI API key (server-side only; never expose to browser).
 *
 * NOTE: This file is a stub. The API call bodies are marked 'Not implemented'.
 * Wire up the real Gemini SDK in Step 3 (AI integration).
 */

import type { GenerateOptions, GenerateResult } from './index'

// ---------- Constants ----------

const GEMINI_MODEL = 'gemini-2.0-flash-exp'
const MAX_RETRIES = 3
const BASE_BACKOFF_MS = 500

// ---------- Error Type ----------

/**
 * Typed error thrown by all Gemini functions.
 * The `message` field is user-friendly (safe to display in the UI).
 * The `cause` field contains the original error for logging.
 */
export class GeminiError extends Error {
  /** HTTP status code from the Gemini API, if available. */
  readonly status?: number
  /** The underlying error that caused this failure. */
  readonly cause?: unknown

  constructor(message: string, options?: { status?: number; cause?: unknown }) {
    super(message)
    this.name = 'GeminiError'
    this.status = options?.status
    this.cause = options?.cause
  }
}

// ---------- Retry Helper ----------

/**
 * Executes an async operation with exponential backoff on rate-limit (429) errors.
 *
 * @param fn - The async operation to execute.
 * @param retries - Maximum number of retry attempts (not counting the initial try).
 * @returns The resolved value of `fn`.
 * @throws The last error if all retries are exhausted.
 */
async function withRetry<T>(
  fn: () => Promise<T>,
  retries: number = MAX_RETRIES
): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err

      const isRateLimit =
        err instanceof GeminiError && err.status === 429

      if (!isRateLimit || attempt === retries) {
        throw err
      }

      // Exponential backoff: 500ms, 1000ms, 2000ms …
      const delay = BASE_BACKOFF_MS * Math.pow(2, attempt)
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }

  // Unreachable but required by TypeScript
  throw lastError
}

// ---------- Generation ----------

/**
 * Generates a text or structured JSON response using Gemini Flash.
 *
 * @param options - GenerateOptions from ai/index.ts.
 * @returns GenerateResult with text and optional parsed value.
 * @throws {GeminiError} on API error, invalid JSON, or exhausted retries.
 *
 * TODO (Step 3): Replace stub with real @google/generative-ai SDK call.
 */
export async function generateWithGemini(
  options: GenerateOptions
): Promise<GenerateResult> {
  void options // suppress unused-variable warning in stub
  void GEMINI_MODEL

  return withRetry(async () => {
    throw new GeminiError(
      'AI is not yet connected. Wire up Gemini in Step 3.',
      { status: 501 }
    )
  })
}

// ---------- Transcription ----------

/**
 * Transcribes audio to text using Gemini's audio-understanding capability.
 *
 * The audio blob (typically webm/opus from MediaRecorder) is base64-encoded
 * and sent as an inline Part to the Gemini Files or inline audio API.
 *
 * @param audioBlob - Raw audio data from the browser's MediaRecorder.
 * @returns The transcribed text string.
 * @throws {GeminiError} on API error or exhausted retries.
 *
 * TODO (Step 3): Replace stub with real @google/generative-ai SDK call.
 */
export async function transcribeWithGemini(audioBlob: Blob): Promise<string> {
  void audioBlob // suppress unused-variable warning in stub
  void GEMINI_MODEL

  return withRetry(async () => {
    throw new GeminiError(
      'Transcription is not yet connected. Wire up Gemini in Step 3.',
      { status: 501 }
    )
  })
}
