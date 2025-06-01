// File: src/components/HistoryList.js
export default class HistoryList {
  constructor(onSelect) {
    this.onSelect = onSelect;
    this.history = JSON.parse(localStorage.getItem('history') || '[]');
    this.element = document.createElement('div');
    this.element.className = 'mt-6';
    this.render();
  }

  add(name, text) {
    this.history.unshift({ name, text });
    if (this.history.length > 10) this.history.pop();
    localStorage.setItem('history', JSON.stringify(this.history));
    this.render();
  }

  render() {
    this.element.innerHTML = `
      <h2 class="text-lg font-semibold mb-2">History</h2>
      <ul class="list-disc list-inside">${this.history.map((item, i) => `
        <li class="flex justify-between items-center mb-1">
          <button class="text-blue-500 underline" data-idx="${i}">${item.name}</button>
          <button class="text-red-500" data-del-idx="${i}">✕</button>
        </li>`).join('')}
      </ul>
    `;

    this.element.querySelectorAll('[data-idx]').forEach(btn => {
      btn.addEventListener('click', () => this.onSelect(this.history[btn.dataset.idx]));
    });
    this.element.querySelectorAll('[data-del-idx]').forEach(btn => {
      btn.addEventListener('click', () => this.delete(btn.dataset['delIdx']));
    });
  }

  delete(idx) {
    this.history.splice(idx, 1);
    localStorage.setItem('history', JSON.stringify(this.history));
    this.render();
  }

  mount(parent) {
    parent.appendChild(this.element);
  }
}
