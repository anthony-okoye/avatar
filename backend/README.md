# Personification Backend

NestJS backend for the Personification MVP - an AI-powered persona generator that transforms LinkedIn profiles and design briefs into actionable designer personas with audio briefings.

## Architecture

This backend orchestrates a four-step AI pipeline:
1. **Firecrawl** - Scrapes LinkedIn profiles
2. **Gemini (Vertex AI)** - Analyzes profiles and generates personas
3. **Gemini** - Creates audio scripts
4. **ElevenLabs** - Synthesizes speech

## Setup

### Prerequisites

- Node.js 18+ and npm
- Google Cloud account with Vertex AI enabled
- ElevenLabs API key
- Firecrawl API key

### Installation

```bash
npm install
```

### Environment Configuration

Copy `.env.example` to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required environment variables:
- `GOOGLE_CLOUD_PROJECT_ID` - Your Google Cloud project ID
- `GOOGLE_CLOUD_LOCATION` - Vertex AI location (default: us-central1)
- `ELEVENLABS_API_KEY` - Your ElevenLabs API key
- `FIRECRAWL_API_KEY` - Your Firecrawl API key
- `PORT` - Server port (default: 3001)

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run build
npm run start:prod
```

## Project Structure

```
src/
├── linkedin/           # LinkedIn profile scraping service
├── gemini/            # Gemini AI integration service
├── elevenlabs/        # ElevenLabs TTS service
├── persona-pipeline/  # Main orchestration service
│   └── dto/          # Data Transfer Objects
├── app.module.ts     # Root module
└── main.ts           # Application entry point
```

## API Endpoints

### POST /api/persona/generate

Generate a persona from a LinkedIn profile and design brief.

**Request Body:**
```json
{
  "linkedinUrl": "https://linkedin.com/in/username",
  "designBrief": "Design a mobile app for..."
}
```

**Response:**
```json
{
  "persona": { ... },
  "audioUrl": "...",
  "audioScript": "...",
  "processingTime": 25000
}
```

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Development

This project uses:
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **class-validator** - DTO validation
- **@google-cloud/vertexai** - Gemini AI integration
- **@elevenlabs/elevenlabs-js** - Text-to-speech
- **@mendable/firecrawl-js** - Web scraping

## License

UNLICENSED
