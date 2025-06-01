// File: src/index.js
import './styles/globals.css';
import UploadArea from './components/UploadArea.js';
import TranscriptView from './components/TranscriptView.js';
import HistoryList from './components/HistoryList.js';
import { transcribeAudio } from './utils/api.js';

const app = document.getElementById('app');

// Theme toggle (light/dark)
const toggle = document.createElement('button');
toggle.textContent = 'Toggle Theme';
toggle.className = 'mt-4 px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded';
toggle.addEventListener('click', () => {
  document.documentElement.classList.toggle('dark');
});

app.appendChild(toggle);


// Components
const uploadArea = new UploadArea(async file => {
  status.textContent = 'Transcribing...';
  try {
    const text = await transcribeAudio(file, pct => {
      status.textContent = `Transcribing... ${pct}%`;
    });
    transcriptView.render(text);
    historyList.add(file.name, text);
  } catch (err) {
    alert(err.message);
  } finally {
    status.textContent = '';
  }
});
const status = document.createElement('p');
status.className = 'mt-4';
const transcriptView = new TranscriptView();
const historyList = new HistoryList(item => {
  transcriptView.render(item.text);
});

// Mount all
uploadArea.mount(app);
arrayFrom([status, transcriptView, historyList]).forEach(el => app.appendChild(el));

function arrayFrom(nodes) { return Array.prototype.slice.call(nodes); }
