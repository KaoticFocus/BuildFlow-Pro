// File: netlify/functions/generate-sow-html.js

/**
 * Netlify Function: generate-sow-html
 *
 * Input (POST JSON): { projectName: string, transcript: string }
 * Output (JSON): { html: string }
 *
 * We ask ChatGPT to:
 *   1) List “Key Points” (bullet list).
 *   2) List “Assumptions” (bullet list).
 *   3) Produce a complete “Scope of Work” with:
 *        - Scope Overview (paragraph)
 *        - Tasks & Deliverables (bulleted list)
 *        - Materials (bulleted list)
 *        - Timeline (paragraph)
 *   All returned as one HTML fragment (no <html> or <body>), so the client can drop it into Quill.
 */

const fetch = require('node-fetch')

module.exports.handler = async (event) => {
  // 1) Only accept POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' }
  }

  // 2) Grab the OpenAI key
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    console.error('⛔ Missing OPENAI_API_KEY')
    return { statusCode: 500, body: 'Missing OPENAI_API_KEY' }
  }

  // 3) Parse incoming JSON
  let body
  try {
    body = JSON.parse(event.body)
  } catch (err) {
    console.error('⛔ Invalid JSON:', err.message)
    return { statusCode: 400, body: 'Invalid JSON' }
  }

  const { projectName, transcript } = body || {}
  if (
    typeof projectName !== 'string' ||
    projectName.trim().length === 0 ||
    typeof transcript !== 'string' ||
    transcript.trim().length === 0
  ) {
    console.error('⛔ Missing or invalid projectName/transcript:', body)
    return { statusCode: 400, body: 'Missing projectName or transcript' }
  }

  // 4) Build the system prompt as an array of lines, then join with "\n"
  const systemPromptLines = [
    'You are a professional construction consultant. Your job is to read a transcript of a homeowner ↔ contractor discussion and:',
    '',
    '1) Identify and list “Key Points” from the conversation. Each bullet should capture a distinct comment or decision (e.g., “Homeowner wants to remove old tub and install a walk-in shower.” “Mirror size differs from vanity width.” etc.).',
    '',
    '2) Identify and list “Assumptions” you need to make in order to produce a complete Scope of Work. For example:',
    '   – Assume the homeowner wants a frameless glass shower door.',
    '   – Assume the existing plumbing is up to code unless noted otherwise.',
    '   – Assume all new materials must meet 2025 building code requirements.',
    '',
    '3) Generate the main “Scope of Work” in semantic HTML. The structure must be exactly:',
    '',
    '  <h2>Key Points:</h2>',
    '  <ul>',
    '    <li>First key point…</li>',
    '    <li>Second key point…</li>',
    '    …',
    '  </ul>',
    '',
    '  <h2>Assumptions:</h2>',
    '  <ul>',
    '    <li>First assumption…</li>',
    '    <li>Second assumption…</li>',
    '    …',
    '  </ul>',
    '',
    '  <h2>Scope of Work</h2>',
    '',
    '    <h3>Scope Overview:</h3>',
    '    <p>One or two paragraphs summarizing the overall goals for the project (e.g., “Complete bathroom remodel including removal of existing tub and tile, installation of new walk-in shower, replacement of vanity and countertops, swapping out fixtures, etc.”).</p>',
    '',
    '    <h3>Tasks &amp; Deliverables:</h3>',
    '    <ul>',
    '      <li>Detailed bullet: “Demolish existing bathtub, tile, backer board, and vanity.”</li>',
    '      <li>Detailed bullet: “Install new waterproof backer board and thinset.”</li>',
    '      <li>Detailed bullet: “Install new porcelain tile on floor and walls.”</li>',
    '      <li>Detailed bullet: “Install new walk-in shower pan and frameless glass door.”</li>',
    '      <li>Detailed bullet: “Install new vanity cabinet, sink, faucet, and quartz countertop.”</li>',
    '      <li>Detailed bullet: “Replace mirror, lighting fixtures, and exhaust fan.”</li>',
    '      <li>Detailed bullet: “Finish carpentry, paint, caulk, and final cleanup.”</li>',
    '      …',
    '    </ul>',
    '',
    '    <h3>Materials:</h3>',
    '    <ul>',
    '      <li>New 12×24 porcelain tile (floor and walls), white matte finish (200 sf).</li>',
    '      <li>Waterproof cement backer board (HardieBacker), appropriate screws/thinset.</li>',
    '      <li>Pre-sloped shower pan kit (complete drain assembly).</li>',
    '      <li>Frameless glass shower door kit (48″ × 72″, polished chrome hardware).</li>',
    '      <li>Vanity cabinet (36″ wide) with drawers, quartz countertop and undermount sink.</li>',
    '      <li>Delta mono-block sink faucet, new shower valve/trims, new tub spout.</li>',
    '      <li>Toilet (1.28 GPF low-flow) with flange and wax ring.</li>',
    '      <li>Recessed LED downlights (2) and new vent fan with light fixture.</li>',
    '      <li>Epoxy tile grout, premium silicone caulk, primer, and paint.</li>',
    '      …',
    '    </ul>',
    '',
    '    <h3>Timeline:</h3>',
    '    <p>',
    '      Day 1–2: Demolition of existing tub, tile, backer board, vanity, and mirror.<br>',
    '      Day 3: Rough plumbing inspection and prep.<br>',
    '      Day 4–5: Install waterproof backer board and underlayments.<br>',
    '      Day 6–8: Tile installation (floor & walls) and grout.<br>',
    '      Day 9: Set shower pan and install frameless door.<br>',
    '      Day 10: Install vanity, sink, faucet, and countertop.<br>',
    '      Day 11: Install toilet, lighting fixtures, and vent fan.<br>',
    '      Day 12: Caulk, paint touch-ups, and final cleanup.<br>',
    '      Day 13: Final client walkthrough and punchlist completion.<br>',
    '      (Assumes all materials are on site by Day 3.)',
    '    </p>',
    '',
    'Use <strong> tags to bold any critical emphasis (for example, section headings). Return only the HTML fragment—no <html> or <body> tags, no markdown fences.',
  ]

  const systemPrompt = systemPromptLines.join('\n')

  // 5) Build the user prompt, embedding the literal transcript
  const userPromptLines = [
    `Generate a fully detailed Scope of Work for a project titled "${projectName}".`,
    `First list Key Points and Assumptions (as described above), then provide the Scope of Work sections exactly in the HTML structure described.`,
    `Here is the transcript:`,
    `"""${transcript}"""`,
  ]
  const userPrompt = userPromptLines.join('\n')

  // 6) Assemble the ChatCompletion request
  const requestBody = {
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.2,
    max_tokens: 2000,
  }

  // 7) Call OpenAI’s Chat API
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
    return {
      statusCode: 502,
      body: `OpenAI request failed: ${err.message}`,
    }
  }

  if (!openaiRes.ok) {
    const errText = await openaiRes.text()
    console.error(`⛔ OpenAI returned ${openaiRes.status}:`, errText)
    return {
      statusCode: openaiRes.status,
      body: errText || 'OpenAI returned an error',
    }
  }

  let openaiJson
  try {
    openaiJson = await openaiRes.json()
  } catch (err) {
    console.error('⛔ Failed to parse JSON from OpenAI:', err.message)
    return {
      statusCode: 502,
      body: 'Invalid JSON from OpenAI',
    }
  }

  const html = openaiJson.choices?.[0]?.message?.content?.trim()
  if (!html) {
    console.error('⛔ Empty HTML from OpenAI:', JSON.stringify(openaiJson))
    return {
      statusCode: 502,
      body: 'OpenAI did not return HTML',
    }
  }

  // 8) Return the HTML fragment
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ html }),
  }
}
