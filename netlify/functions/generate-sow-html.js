// File: netlify/functions/generate-sow-html.js

/**
 * Netlify Function: generate-sow-html
 *
 * Input (POST JSON):
 * {
 *   projectName: string,
 *   images: [ { name: string, data: string (base64) }, … ],
 *   documents: [ { name: string, data: string (base64) }, … ]
 * }
 *
 * Output (JSON):
 * { html: string }
 *
 * We now pass image/document file info into ChatGPT so it can factor
 * them into “Key Points,” “Assumptions,” and each SOW subsection.
 */

const fetch = require('node-fetch')

module.exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('⛔ Missing OPENAI_API_KEY')
    return { statusCode: 500, body: 'Missing OPENAI_API_KEY' }
  }

  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    console.error('⛔ Invalid JSON:', err.message)
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { projectName, images, documents } = body || {}
  if (!projectName || typeof projectName !== 'string') {
    console.error('⛔ Missing or invalid projectName:', projectName)
    return { statusCode: 400, body: 'Missing or invalid projectName' }
  }

  // 1) Package a brief summary of each file for the prompt
  const imageInfo =
    Array.isArray(images) && images.length
      ? images.map((img) => `• ${img.name} (image, ${img.data.slice(0, 30)}... base64)`).join('\n')
      : null

  const docInfo =
    Array.isArray(documents) && documents.length
      ? documents.map((doc) => `• ${doc.name} (document, ${doc.data.slice(0, 30)}... base64)`).join('\n')
      : null

  // 2) Build system prompt (array of lines → join)
  const systemPromptLines = [
    'You are a professional construction consultant, reading a homeowner ↔ contractor discussion transcript.',
    '',
    'You have the following additional files uploaded (if any):',
    imageInfo ? `Images:\n${imageInfo}` : 'Images: None',
    docInfo ? `Documents:\n${docInfo}` : 'Documents: None',
    '',
    'Your tasks:',
    '1) Make a “Key Points” bullet list of everything the homeowner and contractor mentioned (include any details gleaned from the images or documents).',
    '2) Make an “Assumptions” bullet list, listing every assumption you need to fill in missing details (for example, assume certain tile dimensions from the image).',
    '3) Generate the full “Scope of Work” in semantic HTML with exactly this structure:',
    '',
    '  <h2>Key Points:</h2>',
    '  <ul>',
    '    <li>…</li>',
    '  </ul>',
    '',
    '  <h2>Assumptions:</h2>',
    '  <ul>',
    '    <li>…</li>',
    '  </ul>',
    '',
    '  <h2>Scope of Work</h2>',
    '    <h3>Scope Overview:</h3>',
    '    <p>…(two paragraphs summarizing all goals, including references to the files if relevant)…</p>',
    '',
    '    <h3>Tasks &amp; Deliverables:</h3>',
    '    <ul>',
    '      <li>…</li>',
    '    </ul>',
    '',
    '    <h3>Materials:</h3>',
    '    <ul>',
    '      <li>…</li>',
    '    </ul>',
    '',
    '    <h3>Timeline:</h3>',
    '    <p>…(detailed, day‐by‐day timeline, factoring in any lead times from the documents/images)…</p>',
    '',
    'Use <strong> tags to bold any critical headings or emphasis. Return only the HTML fragment—no <html> or <body> tags.',
  ]
  const systemPrompt = systemPromptLines.join('\n')

  // 3) Build user prompt (no transcript needed on this branch, since it's separate)
  const userPromptLines = [
    `Create a fully detailed Scope of Work for project "${projectName}".`,
    'Use the transcript loaded in a previous step, and the information from any images or documents above.',
    'Return exactly the HTML fragment as specified.',
  ]
  const userPrompt = userPromptLines.join('\n')

  // 4) Send request to OpenAI
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  }

  let openaiRes
  try {
    openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    })
  } catch (err) {
    console.error('⛔ OpenAI request failed:', err.message)
    return { statusCode: 502, body: `OpenAI request failed: ${err.message}` }
  }

  if (!openaiRes.ok) {
    const errText = await openaiRes.text()
    console.error(`⛔ OpenAI returned ${openaiRes.status}:`, errText)
    return { statusCode: openaiRes.status, body: errText || 'OpenAI returned an error' }
  }

  let openaiJson
  try {
    openaiJson = await openaiRes.json()
  } catch (err) {
    console.error('⛔ Failed to parse JSON from OpenAI:', err.message)
    return { statusCode: 502, body: 'Invalid JSON from OpenAI' }
  }

  const html = openaiJson.choices?.[0]?.message?.content?.trim()
  if (!html) {
    console.error('⛔ Empty HTML from OpenAI response:', JSON.stringify(openaiJson))
    return { statusCode: 502, body: 'OpenAI did not return HTML' }
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  }
}
