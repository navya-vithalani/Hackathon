import { NextResponse, type NextRequest } from 'next/server'
import { transcribe } from '@/services/ai'
import { GeminiError, getGeminiFailure } from '@/services/ai/gemini'
import { AuthenticationRequiredError, getAuthenticatedUser } from '@/services/supabase/authenticated-user'

const MAX_AUDIO_BYTES = 1_000_000
const MAX_REQUEST_BYTES = 1_100_000

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get('content-length') ?? 0)
  if (contentLength > MAX_REQUEST_BYTES) {
    return NextResponse.json({ error: 'Recording is too large. Keep clips under 1 MB.' }, { status: 413 })
  }

  try {
    await getAuthenticatedUser()

    const formData = await request.formData()
    const audio = formData.get('audio')
    if (!(audio instanceof File) || audio.size === 0) {
      return NextResponse.json({ error: 'Record a short voice note before transcribing.' }, { status: 400 })
    }
    if (audio.size > MAX_AUDIO_BYTES) {
      return NextResponse.json({ error: 'Recording is too large. Keep clips under 1 MB.' }, { status: 413 })
    }
    if (!audio.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'Use a supported audio recording.' }, { status: 415 })
    }

    const text = await transcribe(audio)
    if (!text) {
      return NextResponse.json({ error: 'No speech detected. Try again or type your event notes.' }, { status: 422 })
    }

    return NextResponse.json({ text })
  } catch (error) {
    if (error instanceof AuthenticationRequiredError) {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    if (error instanceof GeminiError) {
      const failure = getGeminiFailure(error, 'voice transcription')
      return NextResponse.json({ error: failure.message }, { status: failure.status })
    }

    console.error('Voice transcription request failed:', error)
    return NextResponse.json(
      { error: 'Voice transcription is unavailable right now. You can still type your event notes.' },
      { status: 503 },
    )
  }
}
