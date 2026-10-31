import { eventStructureSchema, type EventStructureResult } from '@/lib/schemas/ai'

export async function structureEvent(input: {
  event_id?: string
  messages: { role: 'user' | 'model'; content: string }[]
}): Promise<EventStructureResult> {
  const response = await fetch('/api/ai/structure', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })

  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'error' in payload &&
      typeof payload.error === 'string'
      ? payload.error
      : 'Could not structure this event. Please try again.'
    throw new Error(message)
  }

  const result = eventStructureSchema.safeParse(payload)
  if (!result.success) {
    throw new Error('The event assistant returned an unexpected response. Please try again.')
  }
  return result.data
}

export async function transcribeAudio(audio: Blob): Promise<string> {
  const formData = new FormData()
  formData.append('audio', new File([audio], 'event-notes.webm', {
    type: audio.type || 'audio/webm',
  }))

  const response = await fetch('/api/ai/transcribe', { method: 'POST', body: formData })
  const payload: unknown = await response.json().catch(() => null)

  if (!response.ok) {
    const message = typeof payload === 'object' && payload !== null && 'error' in payload &&
      typeof payload.error === 'string'
      ? payload.error
      : 'Voice transcription is unavailable. You can type your event notes instead.'
    throw new Error(message)
  }

  if (typeof payload !== 'object' || payload === null || !('text' in payload) ||
      typeof payload.text !== 'string' || !payload.text.trim()) {
    throw new Error('No speech detected. Try again or type your event notes.')
  }
  return payload.text.trim()
}
