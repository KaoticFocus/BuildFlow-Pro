// File: src/index.js

import './styles/globals.css'
import 'quill/dist/quill.snow.css'
import Quill from 'quill'
import htmlToRtf from 'html-to-rtf'
import uploadArea from './components/UploadArea.js'
import HistoryList from './components/HistoryList.js'
import { transcribeAudio, textToRtf } from './utils/api.js'

/* ── 1) Grab all relevant elements from the DOM ──────────────────────────── */
// Project Name
const projectNameInput = document.getElementById('project-name')

// Upload section wrapper + inputs
const uploadSection = document.getElementById('upload-section')
const audioInput = document.getElementById('audio-upload')
const imageInput = document.getElementById('image-upload')
const docInput = document.getElementById('doc-upload')

// Status & Download Transcript button
const status = document.getElementById('status')
const downloadTranscriptBtn = document.getElementById('download-transcript-btn')

// Edit / Generate Scope of Work
const editGenerateBtn = document.getElementById('edit-generate-btn')

// Quill toolbar & editor
const toolbarContainer = document.getElementById('toolbar')
const editorContainer = document.getElementById('editor')
const quillEditor = new Quill(editorContainer, {
  modules: { toolbar: '#toolbar' },
  theme: 'snow',
})

// Generate Final / Download Final SOW
const generateFinalBtn = document.getElementById('generate-final-btn')
const downloadFinalBtn = document.getElementById('download-final-sow')

// History container
const historyContainer = document.getElementById('history-container')

/* ── 2) Utility: add or remove “dimmed” + toggle disabled ───────────────── */
function setDimmed(element, shouldDim) {
  if (shouldDim) {
    element.classList.add('dimmed')
    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
      element.disabled = true
    }
  } else {
    element.classList.remove('dimmed')
    if (element.tagName === 'BUTTON' || element.tagName === 'INPUT') {
      element.disabled = false
    }
  }
}

/* ── 3) On page-load: ensure everything except Project Name is dimmed ───── */
window.addEventListener('DOMContentLoaded', () => {
  const toDimOnLoad = [
    uploadSection,
    audioInput,
    imageInput,
    docInput,
    status,
    downloadTranscriptBtn,
    editGenerateBtn,
    toolbarContainer,
    editorContainer,
    generateFinalBtn,
    downloadFinalBtn,
    historyContainer,
  ]
  toDimOnLoad.forEach(el => setDimmed(el, true))
})

/* ── 4) Whenever Project Name changes: if empty, re-dim everything; otherwise un-dim upload section + inputs ─ */
projectNameInput.addEventListener('input', () => {
  const name = projectNameInput.value.trim()

  if (name.length === 0) {
    // Project Name is empty again → re-dim entire upload-section + its inputs
    setDimmed(uploadSection, true)
    setDimmed(audioInput, true)
    setDimmed(imageInput, true)
    setDimmed(docInput, true)

    // Re-dim any downstream controls as well
    setDimmed(status, true)
    setDimmed(downloadTranscriptBtn, true)
    setDimmed(editGenerateBtn, true)
    setDimmed(toolbarContainer, true)
    setDimmed(editorContainer, true)
    setDimmed(generateFinalBtn, true)
    setDimmed(downloadFinalBtn, true)
    setDimmed(historyContainer, true)
  } else {
    // Project Name is non-empty → un-dim entire upload-section + its inputs
    setDimmed(uploadSection, false)
    setDimmed(audioInput, false)
    setDimmed(imageInput, false)
    setDimmed(docInput, false)

    // Leave other controls (downloadTranscript, editGenerate, etc.) in their current state—
    // they will become un-dimmed later (e.g. when a file is selected or transcription finishes).
  }
})

/* ── 5) As soon as ANY file is selected (audio OR image OR doc), enable “Edit SOW” ─── */
function maybeEnableEditButton() {
  const anyAudio = audioInput.files.length > 0
  const anyImages = imageInput.files.length > 0
  const anyDocs = docInput.files.length > 0
  if (anyAudio || anyImages || anyDocs) {
    setDimmed(editGenerateBtn, false)
  } else {
    setDimmed(editGenerateBtn, true)
  }
}

// Attach to all three “change” events:
audioInput.addEventListener('change', () => {
  maybeEnableEditButton()
})
imageInput.addEventListener('change', () => {
  maybeEnableEditButton()
})
docInput.addEventListener('change', () => {
  maybeEnableEditButton()
})

/* ── 6) Transcription Flow: when user chooses an audio file ─────────────── */
audioInput.addEventListener('change', async () => {
  if (audioInput.files.length === 0) return

  // 6a) Dim older controls, show status
  setDimmed(downloadTranscriptBtn, true)
  setDimmed(editGenerateBtn, false) // Already enabled if a file was chosen
  setDimmed(status, false)
  status.textContent = 'Transcribing… 0%'

  // 6b) Transcribe:
  let transcriptText = ''
  try {
    transcriptText = await transcribeAudio(audioInput.files[0], (pct) => {
      status.textContent = `Transcribing… ${pct}%`
    })
  } catch (err) {
    alert('Transcription failed: ' + err.message)
    status.textContent = ''
    setDimmed(status, true)
    return
  }

  // 6c) Transcription succeeded:
  status.textContent = ''
  setDimmed(status, true)

  // Create RTF blob for download
  const rtf = textToRtf(transcriptText)
  const transcriptBlob = new Blob([rtf], { type: 'application/rtf' })
  downloadTranscriptBtn.dataset.blobUrl = URL.createObjectURL(transcriptBlob)
  downloadTranscriptBtn.dataset.filename =
    (projectNameInput.value.trim() || 'Project') + ' – Transcript.rtf'

  setDimmed(downloadTranscriptBtn, false)

  // Un-dim History container (if first entry) and add to it
  setDimmed(historyContainer, false)
  historyList.add({
    projectName: projectNameInput.value.trim(),
    audioFileName: audioInput.files[0].name,
  })
})

/* ── 7) “Download Transcript (RTF)” Button Click ───────────────────────── */
downloadTranscriptBtn.addEventListener('click', () => {
  const url = downloadTranscriptBtn.dataset.blobUrl
  const filename = downloadTranscriptBtn.dataset.filename
  if (!url) {
    alert('No transcript available yet.')
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
})

/* ── 8) “Edit Scope of Work” Button Click ───────────────────────────────── */
editGenerateBtn.addEventListener('click', async () => {
  const projectName = projectNameInput.value.trim()
  if (!projectName) {
    alert('Please enter a Project Name.')
    return
  }

  // If toolbar is still dimmed, then we are editing for the first time
  if (toolbarContainer.classList.contains('dimmed')) {
    // 8a) Disable button, show loading text
    editGenerateBtn.disabled = true
    editGenerateBtn.textContent = '⟳ Generating…'

    // 8b) Gather base64 images & documents
    const imagesArray = Array.from(imageInput.files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({ name: file.name, data: reader.result })
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
    })
    const docsArray = Array.from(docInput.files).map((file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => {
          resolve({ name: file.name, data: reader.result })
        }
        reader.onerror = () => reject(reader.error)
        reader.readAsDataURL(file)
      })
    })

    let images = []
    let documents = []
    try {
      images = await Promise.all(imagesArray)
      documents = await Promise.all(docsArray)
    } catch (readErr) {
      alert('Error reading images/documents: ' + readErr.message)
      editGenerateBtn.textContent = 'Edit Scope of Work'
      editGenerateBtn.disabled = false
      return
    }

    // 8c) Call the Netlify function to generate SOW HTML
    let responseJson = null
    try {
      const resp = await fetch('/.netlify/functions/generate-sow-html', {
        method: 'POST',
        body: JSON.stringify({
          projectName,
          images,
          documents,
        }),
      })
      if (!resp.ok) {
        const text = await resp.text()
        throw new Error(text)
      }
      responseJson = await resp.json()
    } catch (err) {
      alert('Failed to generate editable SOW: ' + err.message)
      editGenerateBtn.textContent = 'Edit Scope of Work'
      editGenerateBtn.disabled = false
      return
    }

    // 8d) Un-dim Quill toolbar/editor and populate it
    toolbarContainer.classList.remove('dimmed')
    editorContainer.classList.remove('dimmed')
    quillEditor.root.innerHTML = responseJson.html || '<p>(no SOW content)</p>'

    // 8e) Swap button text to “Generate Scope of Work”
    editGenerateBtn.textContent = 'Generate Scope of Work'
    editGenerateBtn.disabled = false

    // 8f) Un-dim the “Generate Final Scope of Work” button
    setDimmed(generateFinalBtn, false)
  }
})

/* ── 9) “Generate Final Scope of Work” Button Click ───────────────────── */
generateFinalBtn.addEventListener('click', () => {
  const html = quillEditor.root.innerHTML.trim()
  if (!html) {
    alert('Editor is empty—please edit before generating final RTF.')
    return
  }
  const rtf = htmlToRtf.convertHtmlToRtf(html)
  const projectName = projectNameInput.value.trim() || 'Project'
  const blob = new Blob([rtf], { type: 'application/rtf' })
  const url = URL.createObjectURL(blob)

  // Store on the Download Final button, then un-dim it
  downloadFinalBtn.dataset.blobUrl = url
  downloadFinalBtn.dataset.filename = `${projectName} – Final SOW.rtf`
  setDimmed(downloadFinalBtn, false)
})

/* ── 10) “Download Final SOW” Button Click ─────────────────────────────── */
downloadFinalBtn.addEventListener('click', () => {
  const url = downloadFinalBtn.dataset.blobUrl
  const filename = downloadFinalBtn.dataset.filename
  if (!url) {
    alert('No SOW available yet.')
    return
  }
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
})

/* ── 11) HistoryList Initialization ────────────────────────────────────── */
const historyList = new HistoryList((item) => {
  // When clicking a history entry, restore that Project Name and dim everything
  projectNameInput.value = item.projectName

  // Un-dim inputs so they can interact again, but dim everything else:
  setDimmed(uploadSection, false)
  setDimmed(audioInput, false)
  setDimmed(imageInput, false)
  setDimmed(docInput, false)
  setDimmed(status, true)
  setDimmed(downloadTranscriptBtn, true)
  setDimmed(editGenerateBtn, false)
  setDimmed(toolbarContainer, true)
  setDimmed(editorContainer, true)
  setDimmed(generateFinalBtn, true)
  setDimmed(downloadFinalBtn, true)
})
historyList.mount(historyContainer)
