// File: src/utils/api.js

/**
 * Wraps a plain‐text string into a minimal valid RTF block.
 * This is enough for Word/RichText editors to open it.
 */
function textToRtf(plainText) {
  // Escape backslashes and braces for RTF
  const escaped = plainText
    .replace(/\\/g, '\\\\')
    .replace(/{/g, '\\{')
    .replace(/}/g, '\\}')
    .replace(/\n/g, '\\par\n'); // use \par for line breaks

  // Build a minimal RTF header:
  return `{\rtf1\ansi\deff0\n${escaped}\n}`;
}

/**
 * Send an audio File object to /transcribe; returns plain‐text transcript.
 * onProgress(pct) gets called with percentage updates.
 */
export async function transcribeAudio(file, onProgress) {
  const fileBase64 = await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result.split(',')[1])
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsDataURL(file)
  })

  onProgress && onProgress(0)
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
    const errorText = await resp.text()
    throw new Error(errorText || 'Transcription endpoint failed')
  }

  onProgress && onProgress(100)
  const { text } = await resp.json()
  return text
}

/**
 * Given a projectName and transcript, call /generate-sow.
 * Returns the raw RTF string containing a Scope of Work.
 */
export async function generateSOW(projectName, transcript) {
  const resp = await fetch('/.netlify/functions/generate-sow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ projectName, transcript })
  })

  if (!resp.ok) {
    const errorText = await resp.text()
    throw new Error(errorText || 'generateSOW endpoint failed')
  }

  const { rtf } = await resp.json()
  return rtf
}

export { textToRtf }
