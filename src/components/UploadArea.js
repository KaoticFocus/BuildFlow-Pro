// File: src/components/UploadArea.js
export default class UploadArea {
  constructor(onFileSelected) {
    this.onFileSelected = onFileSelected;
    this.element = document.createElement('div');
    this.element.className = 'border-2 border-dashed border-gray-300 p-6 rounded-lg text-center hover:border-gray-500 transition';
    this.element.innerHTML = `
      <p class="mb-2">Drag & drop audio here, or <span class="text-blue-600 underline cursor-pointer" id="file-trigger">browse</span></p>
      <input type="file" id="file-input" class="hidden" accept="audio/*" />
    `;

    const trigger = this.element.querySelector('#file-trigger');
    const fileInput = this.element.querySelector('#file-input');

    trigger.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', () => this.handleFile(fileInput.files[0]));

    ['dragover', 'dragleave', 'drop'].forEach(evt => {
      this.element.addEventListener(evt, e => e.preventDefault());
    });
    this.element.addEventListener('drop', e => {
      if (e.dataTransfer.files.length) this.handleFile(e.dataTransfer.files[0]);
    });
  }

  handleFile(file) {
    const validTypes = ['audio/mpeg', 'audio/mp4', 'audio/wav', 'audio/webm'];
    if (!validTypes.includes(file.type) || file.size > 100 * 1024 * 1024) {
      alert('Invalid file type or size exceeds 100MB.');
      return;
    }
    this.onFileSelected(file);
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
}