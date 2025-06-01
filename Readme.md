# RenoRecap

RenoRecap is a lightweight, browser-based app for quickly transcribing audio recordings of home remodeling discussions between homeowners and contractors. Powered by OpenAI’s Whisper API and designed for simple, offline-first use, RenoRecap lets you upload audio, see and download transcripts, and keep a local history—all without server-side storage.

## Features

* **Drag-and-drop or click-to-upload audio** (MP3, M4A, WAV, WEBM; up to 100 MB)
* **Real-time transcription** via the Whisper API with progress indicator and retry-on-error
* **Transcript display** with optional timestamps and speaker labels
* **Download transcripts** as TXT or DOCX
* **Local transcript history** (last 10 entries) stored in browser
* **Light/dark mode** and WCAG 2.1 AA–compliant UI
* **Fully client-side** with API key obfuscation and encrypted storage

## Getting Started

### Prerequisites

* Node.js (v14+)
* npm or yarn

### Installation

1. Clone the repo:

   ```bash
   git clone https://github.com/your-org/renorecap.git
   cd renorecap
   ```
2. Install dependencies:

   ```bash
   npm install
   # or
   yarn install
   ```
3. Set your OpenAI key in `.env.local`:

   ```bash
   VITE_OPENAI_KEY=sk-proj-...
   ```
4. Generate Tailwind & PostCSS configs:

   ```bash
   npx tailwindcss init -p
   ```

### Development

Start the local dev server with hot reload:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm run serve    # preview the production build
```

### Deploying to Netlify

Netlify will use `netlify.toml` to build and publish the `dist/` folder. Connect your GitHub repository in Netlify and deploy.

## Project Structure

```
A:\WebProjects\RenoRecap
├── public            # Static HTML
├── src
│   ├── assets        # Images & icons
│   ├── components    # UI components (UploadArea, TranscriptView, HistoryList)
│   ├── styles        # Tailwind CSS imports
│   └── utils         # API wrappers
├── .env.local        # Environment variables
├── tailwind.config.js
├── postcss.config.js
├── netlify.toml      # Netlify settings
└── README.md         # This file
```

## Contributing

Contributions are welcome! Please open issues and pull requests on GitHub. Follow the existing code style and include tests for new functionality.

## License

MIT © BuildFlow Pro

## Contact

Keith Blay — [keith.blay@gmail.com](mailto:keith.blay@gmail.com)

Project maintained by BuildFlow Pro. Feel free to reach out with any questions or feedback.
