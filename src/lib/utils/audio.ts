export function playBlob(blob: Blob) {
  const url = URL.createObjectURL(blob)
  const audio = new Audio(url)
  void audio.play()
}
