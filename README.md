# Marketing Ops Hub

Marketing Ops Hub is a portfolio-ready React and Node app for marketing operations and revenue operations workflows. It helps teams build governed UTM links, generate operational campaign briefs, and turn messy process notes into structured documentation.

## Screenshots

Add screenshots before sharing the project publicly:

- Dashboard overview
- Governed UTM Link Builder
- Campaign Brief Generator output
- Documentation Automation output
- Saved Outputs and export workflow

## Feature Overview

- Bright internal SaaS dashboard with responsive sidebar navigation
- Governed UTM Link Builder with standardized picklists, campaign naming, validation, copy actions, and local history
- Campaign Brief Generator with Gemini-backed operational recommendations, readiness scoring, KPI cards, GTM risk context, saved outputs, and exports
- Documentation Automation with structured SOP/process/meeting/action-plan outputs, priority recommendations, workflow logic, maturity insights, saved outputs, and exports
- Local Saved Outputs panel for reopening and deleting generated deliverables
- Download as Markdown, print-to-PDF export, Copy All actions, and toast feedback
- Secure backend API pattern that keeps Gemini keys out of the frontend

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite
- Node.js
- Express
- Google Gemini API
- Local storage for MVP persistence

## Architecture Overview

- `src/` contains the Vite React frontend.
- `src/components/` contains reusable UI and output-rendering components.
- `src/pages/` contains the three main tool workspaces.
- `src/services/` contains frontend API clients.
- `src/utils/` contains UTM, saved-output, and export utilities.
- `server/index.js` starts the Express API.
- `server/routes/` defines API endpoints.
- `server/services/` contains reusable integrations such as Gemini.
- `server/prompts/` centralizes AI prompt templates.
- `server/utilities/` contains validation, operational recommendation helpers, and error handling.

The frontend calls `/api/...` endpoints through the Vite dev proxy. Gemini credentials stay on the backend in `.env` and are never exposed to browser code.

## Environment Variables

Create a local `.env` file in the project root:

```bash
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
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

Both endpoints validate required input, build centralized prompts, call the Gemini service, and return either Gemini output or a mock fallback.

## Deployment Preparation Notes

- Move local-storage persistence to Supabase or another database before supporting multi-user workspaces.
- Store production Gemini keys in the hosting provider's environment variable manager.
- Add server-side rate limiting and request size controls before public launch.
- Configure separate frontend and backend deploy targets or a single Node host that serves the built Vite app.
- Add production logging for AI request failures without logging secret keys or sensitive user inputs.

## Phase Roadmap

- Phase 1: Project scaffold and static dashboard UI
- Phase 2: Governed UTM Link Builder
- Phase 3: Backend and Gemini API foundation
- Phase 4: Campaign Brief Generator workflow
- Phase 5: Documentation Automation workflow
- Phase 6: Productization, persistence, export, and portfolio polish

## Future Enhancements

- Supabase database
- User authentication
- HubSpot campaign integration
- UTM governance rules
- Saved AI outputs in a shared workspace
- Team collaboration
- Export to Google Docs
