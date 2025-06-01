const fetch = require('node-fetch')
const FormData = require('form-data')

module.exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  console.log('🗝️ OPENAI_API_KEY =', apiKey)
  if (!apiKey) {
    return { statusCode: 500, body: 'Missing OPENAI_API_KEY' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { fileBase64, fileName, fileType } = body
  const buff = Buffer.from(fileBase64, 'base64')

  const form = new FormData()
  form.append('file', buff, { filename: fileName, contentType: fileType })
  form.append('model', 'whisper-1')

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...form.getHeaders()
    },
    body: form
  })

  if (!res.ok) {
    const errText = await res.text()
    return { statusCode: res.status, body: errText }
  }

  const { text } = await res.json()
  console.log('📝 Transcript text:', text)

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text })
  }
}
