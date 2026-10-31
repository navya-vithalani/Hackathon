import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { generate } from '@/services/ai'
import { GeminiError } from '@/services/ai/gemini'
import { AuthenticationRequiredError, getAuthenticatedUser } from '@/services/supabase/authenticated-user'
import { eventStructureSchema, structureRequestSchema } from '@/lib/schemas/ai'
import { EVENT_STRUCTURER_PROMPT } from '@/prompts/event-structurer'

const responseSchema = {
  type: 'OBJECT',
  properties: {
    reply: { type: 'STRING' },
    structured: {
      type: 'OBJECT',
      properties: {
        summary: { type: 'STRING' },
        schedule: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              time: { type: 'STRING' },
              title: { type: 'STRING' },
              description: { type: 'STRING' },
            },
            required: ['time', 'title', 'description'],
          },
        },
        rules: { type: 'ARRAY', items: { type: 'STRING' } },
        prizes: { type: 'ARRAY', items: { type: 'STRING' } },
        faqs: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              question: { type: 'STRING' },
              answer: { type: 'STRING' },
            },
            required: ['question', 'answer'],
          },
        },
        contacts: {
          type: 'ARRAY',
          items: {
            type: 'OBJECT',
            properties: {
              name: { type: 'STRING' },
              role: { type: 'STRING' },
              email: { type: 'STRING' },
            },
            required: ['name', 'role'],
          },
        },
      },
      required: ['summary', 'schedule', 'rules', 'prizes', 'faqs', 'contacts'],
    },
    open_questions: { type: 'ARRAY', items: { type: 'STRING' } },
  },
  required: ['reply', 'structured', 'open_questions'],
}

const MAX_REQUEST_BYTES = 60_000

function getErrorResponse(error: unknown) {
  if (error instanceof GeminiError) {
    const status = error.status === 413 ? 413 : error.status === 429 ? 429 : 503
    return NextResponse.json({ error: error.message }, { status })
  }

  console.error('Event structuring request failed:', error)
  return NextResponse.json(
    { error: 'Could not structure this event right now. Please try again.' },
    { status: 503 },
  )
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'That event description is too long. Shorten it and try again.' }, { status: 413 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Send a valid JSON request.' }, { status: 400 })
  }

  const parsed = structureRequestSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Add a short event description and try again.' },
      { status: 400 },
    )
  }

  try {
    const { supabase, user } = await getAuthenticatedUser()

    if (parsed.data.event_id) {
      const { data: event, error: eventError } = await supabase
        .from('events')
        .select('owner_id')
        .eq('id', parsed.data.event_id)
        .maybeSingle()

      if (eventError) throw new Error(`Could not verify event access: ${eventError.message}`)

      let canEdit = event?.owner_id === user.id
      if (!canEdit) {
        const { data: membership, error: membershipError } = await supabase
          .from('event_members')
          .select('role')
          .eq('event_id', parsed.data.event_id)
          .eq('profile_id', user.id)
          .maybeSingle()

        if (membershipError) throw new Error(`Could not verify event access: ${membershipError.message}`)
        canEdit = membership?.role === 'owner' || membership?.role === 'organizer'
      }

      if (!event || !canEdit) {
        return NextResponse.json({ error: 'You do not have permission to edit this event.' }, { status: 403 })
      }
    }

    for (let attempt = 0; attempt < 2; attempt += 1) {
      const result = await generate({
        system: EVENT_STRUCTURER_PROMPT,
        messages: parsed.data.messages,
        schema: responseSchema,
        temperature: 0.4,
      })

      let response: unknown = result.parsed
      if (!response) {
        try {
          response = JSON.parse(result.text)
        } catch {
          if (attempt === 0) continue
          throw new GeminiError('The event assistant returned an invalid response. Please try again.', { status: 503 })
        }
      }

      const validated = eventStructureSchema.safeParse(response)
      if (validated.success) return NextResponse.json(validated.data)
    }

    throw new GeminiError('The event assistant could not format a reliable draft. Please try again.', { status: 503 })
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Add a short event description and try again.' }, { status: 400 })
    }
    return getErrorResponse(error)
  }
}
