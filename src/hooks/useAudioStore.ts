import { create } from 'zustand'

interface AudioStore {
  isRecording: boolean
  setIsRecording: (recording: boolean) => void
  audioBlob: Blob | null
  setAudioBlob: (blob: Blob | null) => void
  error: string | null
  setError: (error: string | null) => void
  clearAudio: () => void
}

export const useAudioStore = create<AudioStore>((set) => ({
  isRecording: false,
  setIsRecording: (isRecording) => set({ isRecording }),
  audioBlob: null,
  setAudioBlob: (audioBlob) => set({ audioBlob }),
  error: null,
  setError: (error) => set({ error }),
  clearAudio: () =>
    set({
      audioBlob: null,
      error: null,
    }),
}))
