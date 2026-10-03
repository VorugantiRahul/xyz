# Elah Studio AI

**A professional, AI-powered browser-based video editing platform built on the Elah engine.**

Upload video → Describe an edit → AI generates a structured plan → Preview → Accept → Timeline updates → Undo in one step.

---

## The Problem

Professional video editing requires expensive desktop software, steep learning curves, and hours of manual work. Non-technical creators can't easily express editing intent without learning complex tooling.

## The Solution

**Elah Studio AI** combines Elah's frame-accurate WebGL2 video engine with a conversational AI assistant that:

1. Accepts natural-language editing requests
2. Converts them into a **structured, validated editing plan**
3. Shows the plan visually (affected clips, operations, expected result) **before touching the timeline**
4. Applies only operations the engine actually supports
5. Wraps everything in a **single undo entry**

---

## Key Features

### ✅ Implemented

| Feature | Status |
|---------|--------|
| Professional 5-zone editor layout | ✅ Complete |
| Media library — upload, preview, insert to timeline | ✅ Complete |
| Multitrack timeline with ruler, playhead, zoom | ✅ Complete |
| Clip drag, trim, split, nudge | ✅ Complete (via `@elah/timeline` ClipBlock) |
| Play/pause/seek with WebGL2 preview | ✅ Complete |
| AI conversational assistant (chat thread) | ✅ Complete |
| Multi-turn conversation context | ✅ Complete |
| Structured editing plan (JSON schema) | ✅ Complete |
| Visual "Intent-to-Edit Timeline" plan card | ✅ Complete |
| Plan validation before execution | ✅ Complete |
| Accept / Reject / Refine workflow | ✅ Complete |
| One-step undo for each AI plan | ✅ Complete |
| Local fallback planner (no API key needed) | ✅ Complete |
| Graceful unsupported-request handling | ✅ Complete |
| OpenAI GPT-4o-mini integration (server-side) | ✅ Complete |
| Add text / subtitle overlays | ✅ Complete |
| Trim, split, delete, move clips | ✅ Complete |
| Add transitions (fade, slide, wipe) | ✅ Complete |
| Set clip speed | ✅ Complete |
| Change aspect ratio (16:9, 9:16, 1:1) | ✅ Complete |
| Export MP4 | ✅ Complete (via `@elah/editor` lazyExportVideo) |
| Project autosave to localStorage | ✅ Complete |
| Supabase schema (SQL migration) | ✅ Ready (apply manually) |
| Supabase client/server helpers | ✅ Complete |
| Resizable panels (left, right, timeline) | ✅ Complete |
| Keyboard shortcuts (Space, Ctrl+Z, etc.) | ✅ Via Elah engine |

### ⚠️ Partially Implemented

| Feature | Notes |
|---------|-------|
| Supabase auth UI | Schema ready; login UI is a future stage |
| Cloud project save | Service layer built; needs auth UI |
| AI edit history persistence | `recordAiEdit()` built; requires Supabase credentials |
| Mute clip | `mute_clip` action planned; `engine.muteClip()` not yet in `@elah/core` |

### ❌ Not Implemented (Elah engine limitation)

| Feature | Reason |
|---------|--------|
| Auto-transcription / speech-to-text | No engine API |
| SRT subtitle import | No engine API |
| Color grading / LUTs | No engine API |
| Video stabilisation | No engine API |
| Background removal / chroma key | No engine API |
| AI music generation | No engine API; use Media Library upload instead |
| Pixabay / Pexels / Freesound search | Optional — keys not configured |

---

## Architecture

```
elah/ (monorepo)
├── packages/
│   ├── core/          @elah/core — TimelineEngine, PlaybackEngine, stores
│   ├── react/         @elah/react — React hooks
│   ├── timeline/      @elah/timeline — <Timeline>, <ClipBlock>, <Ruler>
│   └── editor/        @elah/editor — barrel re-export + media APIs
└── apps/
    └── web/           Next.js 16 application
        ├── app/
        │   └── api/
        │       └── ai/edit-plan/   POST — OpenAI GPT-4o-mini server route
        ├── components/playground/production/
        │   ├── ProductionEditor.tsx        5-zone layout shell
        │   ├── ai/AiAssistantPanel.tsx     Conversational AI panel
        │   ├── panels/MediaLibraryPanel.tsx
        │   └── panels/ …                  Other sidebar panels
        └── lib/
            ├── ai/studioTypes.ts   Schema types
            ├── ai/studioPlanner.ts Local planner + validateEditPlan + applyStudioEditPlan
            └── supabase/           Supabase client, server, project service
```

### AI Workflow

```
User types request
       ↓
POST /api/ai/edit-plan
  { prompt, context (track/clip IDs, fps, frame), history (last 10 turns) }
       ↓
OpenAI GPT-4o-mini (with context-aware system prompt)
  → returns StudioEditPlan JSON (validated against schema)
       ↓
  [on failure / no key → local deterministic planner]
       ↓
validateEditPlan() — checks clip IDs, track IDs, frame bounds
       ↓
Show visual "Intent-to-Edit Timeline" card to user
       ↓
User: Accept / Reject / Refine
       ↓
[Accept] → applyStudioEditPlan() via engine.batch()
         → single undo entry
         → recordAiEdit() to Supabase (if configured)
```

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Video engine | `@elah/core` (WebGL2, frame-accurate) |
| React bindings | `@elah/react`, `@elah/timeline`, `@elah/editor` |
| UI framework | Next.js 16, React 19, Tailwind CSS |
| AI | OpenAI GPT-4o-mini (server-side) + local fallback planner |
| Database | Supabase (PostgreSQL + RLS) |
| Auth | Supabase Auth |
| Storage | Browser IndexedDB (media blobs) + Supabase Storage (optional) |
| State | Zustand (via `@elah/react` stores) |

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | No | GPT-4o-mini for live AI. Falls back to local planner. |
| `OPENAI_MODEL` | No | Override model (default: `gpt-4o-mini`) |
| `NEXT_PUBLIC_SUPABASE_URL` | No | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | No | Supabase anon key (safe for browser) |
| `SUPABASE_SERVICE_ROLE_KEY` | No | Server-only service role (never expose) |
| `PIXABAY_API_KEY` | No | Optional stock footage search |
| `PEXEL_API_KEY` | No | Optional stock photos |
| `FREESOUND_API_KEY` | No | Optional audio samples |

---

## Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com/dashboard)
2. Go to **SQL Editor** → **New Query**
3. Paste and run `supabase/migrations/001_initial_schema.sql`
4. Go to **Project Settings → API** and copy your URL and anon key
5. Add them to `apps/web/.env.local`

---

## How to Run Locally

```bash
# Clone and install
git clone <repo-url>
cd elah
npm install

# Build packages first (required once)
npm run build:web-packages

# Configure environment
cp .env.example apps/web/.env.local
# Edit apps/web/.env.local and add your OPENAI_API_KEY

# Start dev server
npm run dev --workspace=apps/web
# → http://localhost:3001/editor
```

### Run Tests

```bash
# All @elah/timeline tests (75 tests)
npm run test --workspace=packages/timeline

# Core tests (44 tests)
npx vitest run packages/core/src/visitor/split.test.ts packages/core/src/assets/importFiles.test.ts

# TypeScript check
npm run typecheck --workspace=apps/web
```

---

## Known Limitations

- **OpenAI account needs credits.** The local planner handles all common operations offline. Live GPT-4o-mini adds conversation context awareness.
- **No video stabilisation, color grading, or speech-to-text** — the Elah engine does not expose these APIs.
- **Large video files (>500 MB)** may be slow to import in the browser. Use compressed H.264 MP4.
- **Supabase auth UI** is not yet implemented. The schema is ready; cloud save works once credentials are added.
- **Export** requires a modern browser with `VideoEncoder` support (Chrome 94+, Edge 94+).

---

## Demo Instructions

### 30-Second Demo Script

1. **Open** http://localhost:3001/editor
2. **Upload video** — click Media tab → drag an MP4 or click Upload
3. **Insert to timeline** — click the clip thumbnail in the Media Library
4. **Watch timeline** — the clip appears on the video track with accurate duration
5. **Open AI Assistant** — right sidebar (Sparkles tab)
6. **Type a request:**
   > "Make this a 30-second Instagram reel with a title at the beginning and a fade transition"
7. **AI generates plan** — see the visual "Intent-to-Edit Timeline" with numbered operations
8. **Click Apply** — operations execute atomically
9. **Type a refinement:**
   > "Use a slide transition instead"
10. **Accept the updated plan**
11. **Undo** — press Ctrl+Z or click Undo in the AI panel header — entire AI action reverts
12. **Unsupported request:**
    > "Export to DaVinci Resolve"
    → AI shows amber "Not supported" message with explanation

### Key Demo Moments
- The **plan card appears before any edit is made** — always preview first
- **Refine button** allows iterating without re-typing the full request
- **One Ctrl+Z** undoes the entire AI editing session
- **Empty timeline graceful state** — clear call-to-action when no media loaded
- **Unsupported requests** return helpful messages, never crash

---

## Honest Assessment

This is a **working hackathon prototype** built on a production-grade video engine. The AI editing workflow (plan → preview → apply → undo) is fully functional. The main gaps are:
- Cloud auth/save (schema ready, UI pending)
- Advanced video effects (engine limitation)
- Large-scale performance testing

The foundation is solid for a production build: real frame-accurate editing, validated operations, conversation context, and graceful degradation throughout.
