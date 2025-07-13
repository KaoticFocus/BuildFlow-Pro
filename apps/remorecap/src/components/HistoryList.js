// File: src/components/HistoryList.js

export default class HistoryList {
  constructor(onSelect) {
    // onSelect is called when an item is clicked
    // we pass the { projectName, audioFileName } back to index.js
    this.onSelect = onSelect
    this.container = null
    this.items = [] // each item = { projectName, audioFileName }
  }

  mount(parent) {
    this.container = parent
    this.render()
  }

  add(item) {
    // item must be { projectName: string, audioFileName: string }
    this.items.push(item)
    this.render()
  }

  remove(index) {
    this.items.splice(index, 1)
    this.render()
  }

  render() {
    // Clear any previously rendered list (but keep the header)
    // The parent container already has an <h2> for “History”
    while (this.container.children.length > 1) {
      this.container.removeChild(this.container.lastChild)
    }

    if (this.items.length === 0) {
      return
    }

    // Create a UL to hold the history entries
    const ul = document.createElement('ul')
    ul.className = 'list-disc pl-5'

    this.items.forEach((item, index) => {
      const li = document.createElement('li')
      li.className = 'flex items-center justify-between mb-1'

      // Show “ProjectName: audioFileName”
      const textNode = document.createElement('span')
      textNode.textContent = `${item.projectName}: ${item.audioFileName}`

      // “×” button to remove from history
      const btn = document.createElement('button')
      btn.textContent = '×'
      btn.className = 'ml-3 text-red-600 hover:text-red-800'
      btn.onclick = (e) => {
        e.stopPropagation()
        this.remove(index)
      }

      li.appendChild(textNode)
      li.appendChild(btn)
      ul.appendChild(li)
    })

    this.container.appendChild(ul)
  }
}
