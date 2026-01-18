# AI Research Assistant v3.0

An AI-powered research assistant powered by DeepSeek AI with markdown rendering, voice input/output, PDF analysis, and image understanding.

## Features

- 🤖 DeepSeek AI (affordable, high-quality responses)
- 📝 Markdown rendering with code highlighting
- 🎤 Voice input and output
- 🖼️ Image upload and analysis
- 📄 PDF viewer and text extraction
- 📥 Export to PDF, Text, Markdown
- 🌙 Dark mode
- 📱 Mobile responsive
- 🎓 Grade-level adaptive (Elementary to College)
- 📚 Multiple citation styles (APA, MLA, Chicago)

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Get DeepSeek API Key
1. Go to https://platform.deepseek.com/
2. Sign up and create an API key
3. Copy your API key

### 3. Configure Environment
Create `.env.local` in the root directory:
```env
REACT_APP_DEEPSEEK_API_KEY=sk-your-key-here
```

### 4. Start Development Server
```bash
npm start
```

## Deployment
```bash
npm run build
vercel --prod
```

## Cost Estimate

DeepSeek pricing:
- ~$0.14 per 1M input tokens
- ~$0.28 per 1M output tokens
- Typical student usage: $0.50-2.00/month

Much cheaper than OpenAI while maintaining quality!

## Technologies

- React 18
- DeepSeek AI
- Tailwind CSS
- react-markdown
- react-pdf
- jspdf

## License

MIT