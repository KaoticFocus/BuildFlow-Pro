// File: src/index.js

import './styles/globals.css'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import htmlToRtf from 'html-to-rtf'
import UploadArea from './components/UploadArea.js'
import HistoryList from './components/HistoryList.js'
import { transcribeAudio, textToRtf } from './utils/api.js'

/* ── 1) Grab #app ──────────────────────────────────────────────────────────── */
const app = document.getElementById('app')

/* ── 2) Project Name ───────────────────────────────────────────────────────── */
const projectNameContainer = document.createElement('div')
projectNameContainer.className = 'mb-4'
projectNameContainer.innerHTML = `
  <label for="project-name" class="block text-lg font-medium mb-1">
    Project Name
  </label>
  <input
    id="project-name"
    type="text"
    placeholder="Enter project name…"
    class="w-full border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-400"
  />
`
app.appendChild(projectNameContainer)

/* ── 3) Status Line ───────────────────────────────────────────────────────── */
const status = document.createElement('p')
status.className = 'mb-4 text-gray-600'
app.appendChild(status)

/* ── 4) Download Transcript (RTF) ──────────────────────────────────────────── */
const transcriptRtfLink = document.createElement('a')
transcriptRtfLink.textContent = 'Download Transcript (RTF)'
transcriptRtfLink.className = 'mt-2 inline-block px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700'
transcriptRtfLink.style.display = 'none'
app.appendChild(transcriptRtfLink)

/* ── 5) Generate Scope of Work Button ───────────────────────────────────────── */
const generateHtmlSOWBtn = document.createElement('button')
generateHtmlSOWBtn.textContent = 'Generate Scope of Work'
generateHtmlSOWBtn.className = 'mt-2 ml-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700'
generateHtmlSOWBtn.style.display = 'none'
app.appendChild(generateHtmlSOWBtn)

/* ── 6) Image Upload Section ───────────────────────────────────────────────── */
// Label + file input for multiple images
const imageUploadContainer = document.createElement('div')
imageUploadContainer.className = 'mt-4'
imageUploadContainer.innerHTML = `
  <label for="image-upload" class="block text-md font-medium mb-1">
    Upload Images (you can select multiple):
  </label>
  <input
    id="image-upload"
    type="file"
    multiple
    accept="image/*"
    class="border border-gray-300 rounded p-1"
  />
  <div id="image-preview" class="flex flex-wrap gap-2 mt-2"></div>
`
app.appendChild(imageUploadContainer)

/* ── 7) Document Upload Section ─────────────────────────────────────────────── */
// Label + file input for multiple documents
const docUploadContainer = document.createElement('div')
docUploadContainer.className = 'mt-4'
docUploadContainer.innerHTML = `
  <label for="doc-upload" class="block text-md font-medium mb-1">
    Upload Documents (PDF/Word/Excel):
  </label>
  <input
    id="doc-upload"
    type="file"
    multiple
    accept=".pdf,.doc,.docx,.xlsx"
    class="border border-gray-300 rounded p-1"
  />
  <div id="doc-preview" class="mt-2"></div>
`
app.appendChild(docUploadContainer)

/* ── 8) Quill Toolbar & Editor ─────────────────────────────────────────────── */
// Create toolbar placeholder (hidden initially)
const quillToolbar = document.createElement('div')
quillToolbar.id = 'toolbar'
quillToolbar.style.display = 'none'
quillToolbar.innerHTML = `
  <span class="ql-formats">
    <select class="ql-header">
      <option selected></option>
      <option value="1"></option>
      <option value="2"></option>
    </select>
    <button class="ql-bold"></button>
    <button class="ql-italic"></button>
    <button class="ql-underline"></button>
    <button class="ql-list" value="bullet"></button>
    <button class="ql-list" value="ordered"></button>
    <button class="ql-image"></button>
  </span>
`
app.appendChild(quillToolbar)

// Create editor container (hidden initially)
const quillContainer = document.createElement('div')
quillContainer.id = 'editor'
quillContainer.style.display = 'none'
quillContainer.className = 'bg-white border border-gray-300 rounded p-4 min-h-[300px] mt-2'
app.appendChild(quillContainer)

// Initialize Quill
const quillEditor = new Quill(quillContainer, {
  modules: { toolbar: '#toolbar' },
  theme: 'snow'
})

/* ── 9) Generate Final Scope of Work ───────────────────────────────────────── */
const generateFinalSOWBtn = document.createElement('button')
generateFinalSOWBtn.textContent = 'Generate Final Scope of Work'
generateFinalSOWBtn.className = 'mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700'
generateFinalSOWBtn.style.display = 'none'
generateFinalSOWBtn.onclick = () => {
  const finalHtml = quillEditor.root.innerHTML.trim()
  if (!finalHtml) {
    alert('❗ Editor is empty. Please add or edit content before generating the final RTF.')
    return
  }

  // Convert the edited HTML to RTF
  let finalRtf = ''
  try {
    finalRtf = htmlToRtf.convertHtmlToRtf(finalHtml)
  } catch (err) {
    alert(`Error converting HTML to RTF: ${err.message}`)
    return
  }

  // Download the final RTF
  const projectName = document.getElementById('project-name').value.trim() || 'Project'
  const blob = new Blob([finalRtf], { type: 'application/rtf' })
  const url = URL.createObjectURL(blob)

  downloadFinalSOWLink.href = url
  downloadFinalSOWLink.download = `${projectName} – Final SOW.rtf`
  downloadFinalSOWLink.style.display = 'inline-block'
}
app.appendChild(generateFinalSOWBtn)

/* ── 10) Download Final Scope of Work Link ─────────────────────────────────── */
const downloadFinalSOWLink = document.createElement('a')
downloadFinalSOWLink.textContent = 'Download Final Scope of Work (.rtf)'
downloadFinalSOWLink.className = 'mt-2 ml-2 inline-block px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700'
downloadFinalSOWLink.style.display = 'none'
app.appendChild(downloadFinalSOWLink)

/* ── 11) History List ─────────────────────────────────────────────────────── */
const historyList = new HistoryList((item) => {
  // If user chooses a previous audio from history, reset everything
  transcriptRtfLink.style.display = 'none'
  generateHtmlSOWBtn.style.display = 'none'
  quillToolbar.style.display = 'none'
  quillContainer.style.display = 'none'
  generateFinalSOWBtn.style.display = 'none'
  downloadFinalSOWLink.style.display = 'none'
  quillEditor.setContents([]) // clear Quill
})
historyList.mount(app)

/* ── 12) Upload Area ───────────────────────────────────────────────────────── */
const uploadArea = new UploadArea(async (file) => {
  // (a) Hide/reset everything
  transcriptRtfLink.style.display = 'none'
  generateHtmlSOWBtn.style.display = 'none'
  quillToolbar.style.display = 'none'
  quillContainer.style.display = 'none'
  generateFinalSOWBtn.style.display = 'none'
  downloadFinalSOWLink.style.display = 'none'
  quillEditor.setContents([])

  // (b) Validate Project Name
  const projectName = document.getElementById('project-name').value.trim()
  if (!projectName) {
    alert('❗ Please enter a Project Name before uploading audio.')
    return
  }

  // (c) Transcribe
  status.textContent = 'Transcribing… 0%'
  let transcriptText = ''
  try {
    transcriptText = await transcribeAudio(file, (pct) => {
      status.textContent = `Transcribing… ${pct}%`
    })
  } catch (err) {
    alert(`Transcription failed: ${err.message}`)
    status.textContent = ''
    return
  }
  status.textContent = ''

  // (d) Show “Download Transcript (RTF)”
  const transcriptRtf = textToRtf(transcriptText)
  const transcriptBlob = new Blob([transcriptRtf], { type: 'application/rtf' })
  transcriptRtfLink.href = URL.createObjectURL(transcriptBlob)
  transcriptRtfLink.download = `${projectName} – Transcript.rtf`
  transcriptRtfLink.style.display = 'inline-block'

  // (e) Show “Generate Scope of Work” button
  generateHtmlSOWBtn.style.display = 'inline-block'
  generateHtmlSOWBtn.onclick = async () => {
    generateHtmlSOWBtn.disabled = true
    generateHtmlSOWBtn.textContent = '⟳ Generating SOW…'

    let htmlContent = ''
    try {
      // Call function that returns detailed HTML (Key Points, Assumptions, full SOW)
      const resp = await fetch('/.netlify/functions/generate-sow-html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectName, transcript: transcriptText })
      })
      if (!resp.ok) {
        const errorText = await resp.text()
        throw new Error(errorText || 'generate-sow-html failed')
      }
      const json = await resp.json()
      htmlContent = json.html

      // (f) Show Quill toolbar & editor, populate with returned HTML
      quillToolbar.style.display = 'block'
      quillContainer.style.display = 'block'
      quillEditor.root.innerHTML = htmlContent

      // (g) Show Image + Document inputs (so user can upload attachments)
      document.getElementById('image-upload').style.display = 'block'
      document.getElementById('doc-upload').style.display = 'block'
    } catch (err) {
      alert(`Failed to generate editable SOW: ${err.message}`)
    } finally {
      generateHtmlSOWBtn.disabled = false
      generateHtmlSOWBtn.textContent = 'Generate Scope of Work'
      generateFinalSOWBtn.style.display = 'inline-block'
    }
  }
})

uploadArea.mount(app)

/* ── 13) “Upload Images” Handler ──────────────────────────────────────────── */
const imageInput = document.getElementById('image-upload')
const imagePreview = document.getElementById('image-preview')
imageInput.style.display = 'none' // hide until SOW is generated
imageInput.addEventListener('change', () => {
  const files = Array.from(imageInput.files)
  imagePreview.innerHTML = '' // clear old previews

  files.forEach((file) => {
    // 1) Generate a thumbnail preview
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = reader.result
      // 2) Create a small <img> preview
      const imgEl = document.createElement('img')
      imgEl.src = base64
      imgEl.className = 'h-16 w-16 object-cover rounded border'
      imagePreview.appendChild(imgEl)

      // 3) Insert the image into Quill at the current cursor
      const range = quillEditor.getSelection(true)
      quillEditor.insertEmbed(range.index, 'image', base64)
    }
    reader.readAsDataURL(file)
  })
})

/* ── 14) “Upload Documents” Handler ───────────────────────────────────────── */
const docInput = document.getElementById('doc-upload')
const docPreview = document.getElementById('doc-preview')
docInput.style.display = 'none' // hide until SOW is generated
docInput.addEventListener('change', () => {
  const files = Array.from(docInput.files)
  docPreview.innerHTML = '' // clear old links

  files.forEach((file) => {
    // Create a download link for each selected document
    const blobUrl = URL.createObjectURL(file)
    const link = document.createElement('a')
    link.href = blobUrl
    link.download = file.name
    link.textContent = file.name
    link.className = 'block text-blue-600 hover:underline my-1'
    docPreview.appendChild(link)
  })
})
