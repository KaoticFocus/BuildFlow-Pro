// src/utils/api.js
export async function transcribeAudio(file, onProgress) {
  // kick off our “progress” UI
  onProgress && onProgress(0)

  // read the file as base64
  const fileBase64 = await new Promise(resolve => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.readAsDataURL(file)
  })

  const resp = await fetch('/.netlify/functions/transcribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      fileBase64,
      fileName: file.name,
      fileType: file.type
    })
  })

  if (!resp.ok) {
    throw new Error(`Transcription failed: ${resp.statusText}`)
  }

  onProgress && onProgress(100)
  const { text } = await resp.json()
  return text
}
