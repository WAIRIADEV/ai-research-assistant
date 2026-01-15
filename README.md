# AI Research Assistant

An AI-powered research assistant that helps students complete school projects faster and more accurately.

## Features

- 🎓 Grade-level adaptive responses (Elementary to College)
- 📚 Multiple citation styles (APA, MLA, Chicago)
- 💬 Chat-based interface with context memory
- 📄 Export to multiple formats
- 🎯 Academic integrity guardrails
- 🔍 Source transparency

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
REACT_APP_ANTHROPIC_API_KEY=your_api_key_here
```

**Important:** Never commit your API key to version control!

### 3. Start Development Server

```bash
npm start
```

The app will open at `http://localhost:3000`

## Project Structure

```
src/
├── components/      # React components
├── services/        # API and external services
├── utils/          # Helper functions and constants
└── styles/         # CSS and styling
```

## Build for Production

```bash
npm run build
```

## Technologies Used

- React 18
- Tailwind CSS
- Lucide React Icons
- Claude AI API

## License

MIT