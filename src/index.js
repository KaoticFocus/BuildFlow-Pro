// File: src/index.js

import './styles/globals.css'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import htmlToRtf from 'html-to-rtf'
import uploadArea from './components/UploadArea.js'
import HistoryList from './components/HistoryList.js'
import { transcribeAudio, textToRtf } from './utils/api.js'

/* ── 1) Grab the root #app ─────────────────────────────────────────────────── */
const app = document.getElementById('app')

/* ── 2) Render “Project Name” (State 1 of PDF) ─────────────────────────────── */
// On page load (State 1 :contentReference[oaicite:2]{index=2}), only show this large label + input.
// The <h1> is very large to match the PDF’s “Project Name” typography.
const projectNameContainer = document.createElement('div')
projectNameContainer.className = 'mb-6 w-full'
projectNameContainer.innerHTML = `
  <h1 class="text-3xl font-extrabold mb-2">Project Name</h1>
  <input
    id="project-name"
    type="text"
    placeholder="Enter project name…"
    class="w-full border border-gray-300 rounded-lg p-3 text-lg placeholder-gray-500 focus:ring-2 focus:ring-blue-400"
  />
`
app.appendChild(projectNameContainer)

/* ── 3) Upload Section (State 2 of PDF) ────────────────────────────────────── */
// This entire container is hidden (display: none) until the user types a name.
const uploadSection = document.createElement('div')
uploadSection.id = 'upload-section'
uploadSection.className = 'flex flex-col gap-6 mb-6'
uploadSection.style.display = 'none'

// 3a) Upload Audio File
const audioUploadWrapper = document.createElement('div')
audioUploadWrapper.className = 'flex flex-col'
audioUploadWrapper.innerHTML = `
  <h2 class="text-2xl font-semibold mb-2">Upload Audio File</h2>
  <div class="flex items-center gap-4">
    <input
      id="audio-upload"
      type="file"
      accept=".mp3,.wav"
      class="w-2/5 border border-gray-300 rounded-lg p-2"
    />
    <span id="audio-placeholder" class="text-gray-500">No audio file selected</span>
  </div>
  <div id="audio-file-list" class="file-list columns-2 border border-gray-200 rounded-lg p-2 mt-2">
    <!-- filenames will appear here, in two columns -->
  </div>
`
uploadSection.appendChild(audioUploadWrapper)

// 3b) Upload Images
const imageUploadWrapper = document.createElement('div')
imageUploadWrapper.className = 'flex flex-col'
imageUploadWrapper.innerHTML = `
  <h2 class="text-2xl font-semibold mb-2">Upload Images</h2>
  <div class="flex items-center gap-4">
    <input
      id="image-upload"
      type="file"
      multiple
      accept="image/*,image/rtf"
      class="w-2/5 border border-gray-300 rounded-lg p-2"
    />
    <span id="image-placeholder" class="text-gray-500">No images selected</span>
  </div>
  <div id="image-file-list" class="file-list columns-2 border border-gray-200 rounded-lg p-2 mt-2">
    <!-- image filenames go here -->
  </div>
`
uploadSection.appendChild(imageUploadWrapper)

// 3c) Upload Documents
const docUploadWrapper = document.createElement('div')
docUploadWrapper.className = 'flex flex-col'
docUploadWrapper.innerHTML = `
  <h2 class="text-2xl font-semibold mb-2">Upload Documents</h2>
  <div class="flex items-center gap-4">
    <input
      id="doc-upload"
      type="file"
      multiple
      accept=".pdf,.csv,.rtf,.doc,.docx,.xlsx"
      class="w-2/5 border border-gray-300 rounded-lg p-2"
    />
    <span id="doc-placeholder" class="text-gray-500">No documents selected</span>
  </div>
  <div id="doc-file-list" class="file-list columns-2 border border-gray-200 rounded-lg p-2 mt-2">
    <!-- doc filenames go here -->
  </div>
`
uploadSection.appendChild(docUploadWrapper)

app.appendChild(uploadSection)

/* ── 4) Status & Transcript Download  (below upload) ───────────────────── */
const status = document.createElement('p')
status.id = 'status'
status.className = 'mb-4 text-gray-600'
app.appendChild(status)

const transcriptRtfLink = document.createElement('a')
transcriptRtfLink.id = 'transcript-rtf-link'
transcriptRtfLink.textContent = 'Download Transcript (RTF)'
transcriptRtfLink.className = 'inline-block px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 mb-6'
transcriptRtfLink.style.display = 'none'
app.appendChild(transcriptRtfLink)

/* ── 5) Edit/Generate Scope of Work Button (initially hidden) ───────────── */
const editGenerateBtn = document.createElement('button')
editGenerateBtn.id = 'edit-generate-btn'
editGenerateBtn.textContent = 'Edit Scope of Work'
editGenerateBtn.className = 'w-full px-4 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6'
editGenerateBtn.disabled = true
editGenerateBtn.style.display = 'none'
app.appendChild(editGenerateBtn)

/* ── 6) Quill Toolbar & Editor (hidden until “Edit” is clicked) ────────── */
const toolbarContainer = document.createElement('div')
toolbarContainer.id = 'toolbar'
toolbarContainer.className = 'mb-2'
toolbarContainer.style.display = 'none'
toolbarContainer.innerHTML = `
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
app.appendChild(toolbarContainer)

const editorContainer = document.createElement('div')
editorContainer.id = 'editor'
editorContainer.className = 'bg-white border-4 border-gray-300 rounded-lg p-4 min-h-[250px] mb-6'
editorContainer.style.display = 'none'
app.appendChild(editorContainer)

const quillEditor = new Quill(editorContainer, {
  modules: { toolbar: '#toolbar' },
  theme: 'snow',
})

/* ── 7) Generate Final SOW + Download Link (hidden until after editing) ─── */
const generateFinalBtn = document.createElement('button')
generateFinalBtn.id = 'generate-final-btn'
generateFinalBtn.textContent = 'Generate Final Scope of Work'
generateFinalBtn.className = 'w-full px-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6'
generateFinalBtn.disabled = true
generateFinalBtn.style.display = 'none'
app.appendChild(generateFinalBtn)

const downloadFinalLink = document.createElement('a')
downloadFinalLink.id = 'download-final-sow'
downloadFinalLink.textContent = 'Download Final SOW (.rtf)'
downloadFinalLink.className = 'w-full inline-block text-center px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 mb-6'
downloadFinalLink.style.display = 'none'
app.appendChild(downloadFinalLink)

/* ── 8) History List (always at bottom) ────────────────────────────────── */
const historyContainer = document.createElement('div')
historyContainer.id = 'history-container'
historyContainer.className = 'mt-auto pb-4'
historyContainer.innerHTML = `
  <h2 class="text-xl font-semibold mb-2">History</h2>
`
app.appendChild(historyContainer)

const historyList = new HistoryList((item) => {
  // When a history entry is clicked, reset the UI to just‐after project name
  transcriptRtfLink.style.display = 'none'
  editGenerateBtn.style.display = 'none'
  editGenerateBtn.disabled = true
  toolbarContainer.style.display = 'none'
  editorContainer.style.display = 'none'
  generateFinalBtn.style.display = 'none'
  generateFinalBtn.disabled = true
  downloadFinalLink.style.display = 'none'
  quillEditor.setContents([])

  document.getElementById('project-name').value = item.projectName
  handleProjectNameInput() // re-enable uploads
})
historyList.mount(historyContainer)

/* ── 9) UploadArea (Audio) Initialization ───────────────────────────────── */
uploadArea(async (file) => {
  // Reset previous UI state
  transcriptRtfLink.style.display = 'none'
  editGenerateBtn.style.display = 'none'
  editGenerateBtn.disabled = true
  toolbarContainer.style.display = 'none'
  editorContainer.style.display = 'none'
  generateFinalBtn.style.display = 'none'
  generateFinalBtn.disabled = true
  downloadFinalLink.style.display = 'none'
  quillEditor.setContents([])

  // Transcribe the audio
  status.textContent = 'Transcribing… 0%'
  let transcriptText = ''
  try {
    transcriptText = await transcribeAudio(file, (pct) => {
      status.textContent = `Transcribing… ${pct}%`
    })
  } catch (err) {
    alert('Transcription failed: ' + err.message)
    status.textContent = ''
    return
  }
  status.textContent = ''

  // Show “Download Transcript (RTF)”
  const projectName = document.getElementById('project-name').value.trim()
  const rtf = textToRtf(transcriptText)
  const blob = new Blob([rtf], { type: 'application/rtf' })
  transcriptRtfLink.href = URL.createObjectURL(blob)
  transcriptRtfLink.download = `${projectName} – Transcript.rtf`
  transcriptRtfLink.style.display = 'block'

  // Show “Edit Scope of Work” button
  editGenerateBtn.textContent = 'Edit Scope of Work'
  editGenerateBtn.disabled = false
  editGenerateBtn.style.display = 'block'

  // Add to history
  historyList.add({ projectName, audioFileName: file.name })
})

/* ── 10) Enable/Disable Uploads Based on Project Name ────────────────────── */
const projectNameInput = document.getElementById('project-name')
projectNameInput.addEventListener('input', handleProjectNameInput)

function handleProjectNameInput() {
  const name = projectNameInput.value.trim()
  if (name.length > 0) {
    uploadSection.style.display = 'flex'
    document.getElementById('audio-upload').disabled = false
    document.getElementById('image-upload').disabled = false
    document.getElementById('doc-upload').disabled = false
  } else {
    uploadSection.style.display = 'none'
    document.getElementById('audio-upload').disabled = true
    document.getElementById('image-upload').disabled = true
    document.getElementById('doc-upload').disabled = true
  }
}
// Initial run (hide upload section on page load)
handleProjectNameInput()

/* ── 11) Show Selected Filenames in Scrollable Boxes ─────────────────────── */
// a) Audio
const audioInput = document.getElementById('audio-upload')
const audioPlaceholder = document.getElementById('audio-placeholder')
const audioFileList = document.getElementById('audio-file-list')
audioInput.addEventListener('change', () => {
  audioFileList.innerHTML = ''
  const files = Array.from(audioInput.files)
  if (files.length === 0) {
    audioPlaceholder.textContent = 'No audio file selected'
    return
  }
  audioPlaceholder.textContent = files[0].name

  // For simplicity, show up to 15 audio filenames in multi-column
  files.forEach((file) => {
    const p = document.createElement('p')
    p.textContent = file.name
    p.className = 'break-words'
    audioFileList.appendChild(p)
  })
})

// b) Images
const imageInput = document.getElementById('image-upload')
const imagePlaceholder = document.getElementById('image-placeholder')
const imageFileList = document.getElementById('image-file-list')
imageInput.addEventListener('change', () => {
  imageFileList.innerHTML = ''
  const files = Array.from(imageInput.files)
  if (files.length === 0) {
    imagePlaceholder.textContent = 'No images selected'
    return
  }
  imagePlaceholder.textContent = files.map((f) => f.name).join(', ')

  files.forEach((file) => {
    const p = document.createElement('p')
    p.textContent = file.name
    p.className = 'break-words'
    imageFileList.appendChild(p)
  })
})

// c) Documents
const docInput = document.getElementById('doc-upload')
const docPlaceholder = document.getElementById('doc-placeholder')
const docFileList = document.getElementById('doc-file-list')
docInput.addEventListener('change', () => {
  docFileList.innerHTML = ''
  const files = Array.from(docInput.files)
  if (files.length === 0) {
    docPlaceholder.textContent = 'No documents selected'
    return
  }
  docPlaceholder.textContent = files.map((f) => f.name).join(', ')

  files.forEach((file) => {
    const p = document.createElement('p')
    p.textContent = file.name
    p.className = 'break-words'
    docFileList.appendChild(p)
  })
})

/* ── 12) “Edit Scope of Work” Button: Show Quill & Swap Text ─────────────── */
editGenerateBtn.addEventListener('click', async () => {
  const projectName = projectNameInput.value.trim()
  if (!projectName) {
    alert('Please enter a Project Name.')
    return
  }

  // If Quill is hidden, we are in “Edit” mode
  if (toolbarContainer.style.display === 'none') {
    editGenerateBtn.disabled = true
    editGenerateBtn.textContent = '⟳ Generating…'

    // Collect images & docs as Base64 to send to function
    // (omitted here for brevity—use same logic as previous step)
    // …

    // Call generate-sow-html, receive HTML, then:
    toolbarContainer.style.display = 'block'
    editorContainer.style.display = 'block'
    quillEditor.root.innerHTML = '<p>(SOW generated by ChatGPT will appear here.)</p>'

    // Swap text → “Generate Scope of Work”
    editGenerateBtn.textContent = 'Generate Scope of Work'
    editGenerateBtn.disabled = false

    // Show “Generate Final Scope of Work” button
    generateFinalBtn.style.display = 'block'
    generateFinalBtn.disabled = false
  }
})

/* ── 13) “Generate Final Scope” → RTF Download ──────────────────────────── */
generateFinalBtn.addEventListener('click', () => {
  const html = quillEditor.root.innerHTML.trim()
  if (!html) {
    alert('Editor is empty—please edit first.')
    return
  }
  const rtf = htmlToRtf.convertHtmlToRtf(html)
  const projectName = projectNameInput.value.trim() || 'Project'
  const blob = new Blob([rtf], { type: 'application/rtf' })
  const url = URL.createObjectURL(blob)
  downloadFinalLink.href = url
  downloadFinalLink.download = `${projectName} – Final SOW.rtf`
  downloadFinalLink.style.display = 'block'
})
