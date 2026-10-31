'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { transcribeAudio } from '@/services/ai/client'

const MAX_RECORDING_MS = 25_000

export function useVoiceInput(onTranscript: (text: string) => void) {
  const [isRecording, setIsRecording] = useState(false)
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<BlobPart[]>([])
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const onTranscriptRef = useRef(onTranscript)

  useEffect(() => {
    onTranscriptRef.current = onTranscript
  }, [onTranscript])

  const stop = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = null
    if (recorderRef.current?.state === 'recording') {
      recorderRef.current.stop()
    }
    setIsRecording(false)
  }, [])

  const start = useCallback(async () => {
    setError(null)
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setError('Voice recording is not supported in this browser. You can type your notes instead.')
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const preferredType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
        ? 'audio/webm;codecs=opus'
        : undefined
      const recorder = new MediaRecorder(stream, preferredType ? { mimeType: preferredType } : undefined)
      chunksRef.current = []
      recorderRef.current = recorder
      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunksRef.current.push(event.data)
      }
      recorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop())
        streamRef.current = null
        const clip = new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' })
        chunksRef.current = []
        if (!clip.size) {
          setError('No audio was captured. Try again or type your notes.')
          return
        }

        setIsTranscribing(true)
        try {
          const transcript = await transcribeAudio(clip)
          onTranscriptRef.current(transcript)
        } catch (caughtError) {
          setError(caughtError instanceof Error ? caughtError.message : 'Could not transcribe that recording.')
        } finally {
          setIsTranscribing(false)
        }
      }
      recorder.start()
      setIsRecording(true)
      timerRef.current = setTimeout(stop, MAX_RECORDING_MS)
    } catch (caughtError) {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
      const denied = caughtError instanceof DOMException && caughtError.name === 'NotAllowedError'
      setError(denied
        ? 'Microphone access was denied. Allow it in your browser settings or type your notes.'
        : 'Could not start the microphone. Check your connection and try again.')
    }
  }, [stop])

  useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current)
    if (recorderRef.current?.state === 'recording') recorderRef.current.stop()
    streamRef.current?.getTracks().forEach((track) => track.stop())
  }, [])

  return { isRecording, isTranscribing, error, start, stop, clearError: () => setError(null) }
}
