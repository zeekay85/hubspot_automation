# Marketing Ops Hub

Marketing Ops Hub is a portfolio-ready React and Node app for marketing and revenue operations workflows. The current build includes a governed UTM Link Builder plus backend foundations for AI-powered campaign briefs and documentation automation.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Node.js
- Express
- Google Gemini API foundation
- Local storage for UTM history

## Architecture Overview

- `src/` contains the Vite React frontend.
- `server/index.js` starts the Express API.
- `server/routes/` defines API endpoints.
- `server/services/` contains reusable integrations such as Gemini.
- `server/prompts/` centralizes prompt templates.
- `server/utilities/` contains validation and error handling.

The frontend calls `/api/...` endpoints through the Vite dev proxy. Gemini credentials stay on the backend in `.env` and are never exposed to browser code.

## Environment Variables

Create a local `.env` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3001
```

`.env` files are ignored by Git. Use `.env.example` as the template.

## Gemini API Key

1. Go to Google AI Studio.
2. Create or select a Gemini API key.
3. Add it to `.env` as `GEMINI_API_KEY`.
4. Restart the backend server after changing `.env`.

If no key is configured, the backend returns mock responses so the frontend can still be tested end to end.

## Run Locally

Install dependencies:

```bash
npm install
```

Start the backend:

```bash
npm run dev:server
```

Start the frontend in a second terminal:

```bash
npm run dev:client
```

Frontend:

```bash
http://localhost:5173
```

Backend health check:

```bash
http://localhost:3001/api/health
```

## API Endpoints

- `POST /api/generate-campaign-brief`
- `POST /api/generate-documentation`

Both endpoints validate required input, build a centralized prompt, call the Gemini service, and return either Gemini output or a mock fallback.

## Current Features

- Bright SaaS dashboard shell
- Campaign Brief Generator connected to backend foundation
- Governed UTM Link Builder with local history
- Documentation Automation connected to backend foundation
- Secure environment variable pattern for Gemini
- Modular backend structure for interviews and future expansion

## Phase Roadmap

- Phase 1: Project scaffold and static dashboard UI
- Phase 2: Governed UTM Link Builder
- Phase 3: Backend and Gemini API foundation
- Phase 4: Deeper Campaign Brief prompt/output workflow
- Phase 5: Deeper Documentation Automation prompt/output workflow
- Phase 6: PDF export, toast polish, README polish, and portfolio context

## Future Enhancements

- Supabase database
- User authentication
- HubSpot campaign integration
- UTM governance rules
- Saved AI outputs
- Team workspace
- Export to Google Docs
