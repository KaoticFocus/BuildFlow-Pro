// File: src/components/TranscriptView.js
import { saveAs } from 'file-saver';

export default class TranscriptView {
  constructor() {
    this.element = document.createElement('div');
    this.element.className = 'mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg';
  }

  render(text) {
    this.element.innerHTML = `
      <pre class="whitespace-pre-wrap mb-4">${text}</pre>
      <button id="download-txt" class="mr-2 px-4 py-2 bg-blue-600 text-white rounded">Download TXT</button>
      <button id="download-docx" class="px-4 py-2 bg-green-600 text-white rounded">Download DOCX</button>
    `;

    this.element.querySelector('#download-txt')
      .addEventListener('click', () => this.download(text, 'transcript.txt', 'text/plain'));
    this.element.querySelector('#download-docx')
      .addEventListener('click', () => this.download(text, 'transcript.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'));
  }

  download(content, filename, type) {
    const blob = new Blob([content], { type });
    saveAs(blob, filename);
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
}
