// File: netlify/functions/generate-sow.js

/**
 * Netlify Function: generate-sow
 *
 * Expects a POST request with JSON { projectName: string, transcript: string }.
 * Calls OpenAI’s Chat Completion endpoint to interpret the transcript and
 * produce a professional Scope of Work document in valid RTF format.
 * Returns: { rtf: "<valid RTF string>" }
 */

const fetch = require('node-fetch')

module.exports.handler = async (event) => {
  // 1) Only accept POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: 'Method Not Allowed'
    }
  }

  // 2) Read the OpenAI API key from environment
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.log('⛔ Missing OPENAI_API_KEY')
    return {
      statusCode: 500,
      body: 'Missing OPENAI_API_KEY'
    }
  }

  // 3) Parse incoming JSON
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    console.log('⛔ Invalid JSON:', err.message)
    return {
      statusCode: 400,
      body: 'Invalid JSON'
    }
  }

  const { projectName, transcript } = body || {}
  if (!projectName || !transcript) {
    console.log('⛔ Missing projectName or transcript:', body)
    return {
      statusCode: 400,
      body: 'Missing projectName or transcript'
    }
  }

  // 4) Build prompts for ChatGPT (no inner backticks)
  const systemPrompt = [
    'You are a professional construction consultant. Read a transcript of a homeowner ↔ contractor discussion, infer exactly what kind of project the homeowner is requesting,',
    'and produce a concise, well‐structured Scope of Work (SOW) document in valid RTF format.',
    '',
    'The SOW must include:',
    '- A heading with the Project Name, the current date, and the title "Scope of Work."',
    '- An introductory "Scope Overview:" summarizing what the homeowner wants.',
    '- A "Tasks & Deliverables:" section listing bullet points for each major task.',
    '- A "Materials:" section listing key materials or fixtures mentioned.',
    '- A "Timeline:" section giving a reasonable schedule (for example: "Demolition: X days; Installation: Y days; Final touches: Z days").',
    '- Use bold formatting (RTF syntax: \\b … \\b0) for each of the section headings (Scope Overview, Tasks & Deliverables, Materials, Timeline).',
    '- Use RTF bullet lists (e.g., \\bullet) or numbered lists where appropriate.',
    '- Ensure the output begins with "{\\rtf1\\ansi" and ends with "}", with no extra markdown fences.',
    '',
    'If a section was not explicitly mentioned by the homeowner (for example, timeline), infer a reasonable schedule based on standard construction practice.',
    '',
    'Return the entire SOW as one continuous string of valid RTF.'
  ].join(' ')

  // 5) User prompt with the raw transcript in quotes
  const userPrompt = [
    'Generate a complete Scope of Work document in valid RTF format for a project titled "',
    projectName,
    '".',
    'Below is the transcript of the homeowner ↔ contractor discussion, with quotes for clarity:',
    '"""',
    transcript,
    '"""',
    'Interpret what they want (do not just copy the transcript). Create a full SOW in valid RTF format.'
  ].join(' ')

  const chatRequestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt.trim() },
      { role: 'user', content: userPrompt.trim() }
    ],
    temperature: 0.2,
    max_tokens: 2000
  }

  // 6) Call OpenAI’s Chat Completion endpoint
  let openaiRes
  try {
    openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(chatRequestBody)
    })
  } catch (err) {
    console.log('⛔ OpenAI request failed:', err.message)
    return {
      statusCode: 502,
      body: `OpenAI request failed: ${err.message}`
    }
  }

  if (!openaiRes.ok) {
    const errText = await openaiRes.text()
    console.log(`⛔ OpenAI returned status ${openaiRes.status}:`, errText)
    return {
      statusCode: openaiRes.status,
      body: errText || 'OpenAI returned an error'
    }
  }

  let openaiJson
  try {
    openaiJson = await openaiRes.json()
  } catch (err) {
    console.log('⛔ Failed to parse JSON from OpenAI:', err.message)
    return {
      statusCode: 502,
      body: 'Invalid JSON from OpenAI'
    }
  }

  // 7) Extract the RTF text from the response
  const rtf = openaiJson.choices?.[0]?.message?.content?.trim()
  if (!rtf) {
    console.log('⛔ OpenAI returned empty RTF content:', JSON.stringify(openaiJson))
    return {
      statusCode: 502,
      body: 'OpenAI did not return an RTF string'
    }
  }

  // 8) (Optional) Log first 200 characters of the generated RTF
  console.log('📝 Generated RTF (first 200 chars):', rtf.slice(0, 200))

  // 9) Return the RTF as JSON
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ rtf })
  }
}
