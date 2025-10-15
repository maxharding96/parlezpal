import { useEffect, useRef, useCallback } from 'react'
import { useAudioStore } from './useAudioStore'
import { useShallow } from 'zustand/react/shallow'

interface UseSpacebarRecordingOptions {
  onRecordingComplete?: (audioBlob: Blob) => Promise<void>
  onRecordingStart?: () => void
  onRecordingStop?: () => void
  onError?: (error: string) => void
}

export const useRecord = (options: UseSpacebarRecordingOptions = {}) => {
  const { onRecordingComplete, onRecordingStart, onRecordingStop, onError } =
    options

  const { isRecording, setIsRecording, setAudioBlob, setError } = useAudioStore(
    useShallow((state) => ({
      isRecording: state.isRecording,
      setIsRecording: state.setIsRecording,
      setAudioBlob: state.setAudioBlob,
      setError: state.setError,
    }))
  )

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const startTimeRef = useRef<number>(0)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const startRecording = useCallback(async () => {
    try {
      setError(null)

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        },
      })

      streamRef.current = stream
      chunksRef.current = []

      // Create MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      })

      mediaRecorderRef.current = mediaRecorder

      // Handle data available
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      // Handle recording stop
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        void onRecordingComplete?.(blob)

        // Clean up stream
        if (streamRef.current) {
          streamRef.current.getTracks().forEach((track) => track.stop())
          streamRef.current = null
        }
      }

      // Start recording
      mediaRecorder.start()
      setIsRecording(true)
      startTimeRef.current = Date.now()

      onRecordingStart?.()
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to start recording'
      setError(errorMessage)
      onError?.(errorMessage)
    }
  }, [
    onRecordingComplete,
    onRecordingStart,
    onError,
    setAudioBlob,
    setError,
    setIsRecording,
  ])

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Clear duration timer
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
        durationIntervalRef.current = null
      }

      onRecordingStop?.()
    }
  }, [isRecording, setIsRecording, onRecordingStop])

  // Handle spacebar key events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent recording if user is typing in an input field
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (event.code === 'Space' && !event.repeat && !isRecording) {
        event.preventDefault()
        void startRecording()
      }
    }

    const handleKeyUp = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return
      }

      if (event.code === 'Space' && isRecording) {
        event.preventDefault()
        stopRecording()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [isRecording, startRecording, stopRecording])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current)
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])
}
