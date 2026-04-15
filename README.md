# AI 3D + Avatar Prototypes (NexEra Challenge)

This repository contains two interactive AI prototypes built for the NexEra AI Engineering Challenge:

- Prototype 1: AI-assisted 3D training asset matching and viewing
- Prototype 2: Natural language command to avatar behavior simulation

The goal is functional, demo-ready prototypes that show AI reasoning, interactive 3D UX, and scalable architecture direction.

---

## Live Demo

- Frontend (Vercel): <https://ai-3-d-prototype.vercel.app/>
- Backend (Render): <https://ai-3d-backend-pou6.onrender.com>

---

## What Is Implemented

### Prototype 1: AI-Generated 3D Asset Pipeline (retrieval-focused)

User flow:
- User enters a natural language query
- Backend matches the best training asset
- Frontend renders the matched GLB in a Three.js viewer
- App shows educational summary + reasoning text

Implemented capabilities:
- Natural language query input
- AI-assisted matching with fallback logic
- Interactive 3D viewer (`OrbitControls`, reset view)
- Educational summary and explanation panel

### Prototype 2: Natural Language -> Avatar Behavior

User flow:
- User switches to "Avatar Prototype" mode in-app
- User enters command text (for example: `wave hello`, `point`, `walk`, `idle`)
- Deterministic parser maps text to action
- Avatar performs visible behavior in 3D scene
- App shows short behavior explanation

Implemented capabilities:
- In-app toggle between both prototypes
- Deterministic interpretation logic:
  - contains `wave` -> `wave`
  - contains `point` -> `point`
  - contains `walk` or `move` -> `walk`
  - otherwise -> `idle`
- Primitive-shape humanoid avatar (fast MVP, low risk)
- Visible behaviors:
  - `wave`: clear arm wave
  - `point`: arm extends forward
  - `walk`: avatar moves across scene with motion
  - `idle`: neutral standing pose
- 3D scene controls:
  - `Canvas`, ambient and directional lights, ground plane
  - `OrbitControls`
  - reset camera button

---

## Tech Stack

Frontend:
- React + Vite
- Three.js via `@react-three/fiber`
- `@react-three/drei`

Backend:
- Node.js + Express
- OpenAI API for matching/summarization
- Rule-based fallback matcher

Deployment:
- Frontend on Vercel
- Backend on Render

---

## Architecture (High Level)

### Prototype 1
1. User submits query
2. Frontend sends POST to backend `/api/match-asset`
3. Backend performs AI match (or fallback)
4. Backend returns:
   - `matchedAsset`
   - `educationalSummary`
   - `reason`
5. Frontend updates panels and 3D viewer

### Prototype 2
1. User submits command text
2. Frontend parser maps command to one of: `wave | point | walk | idle`
3. Action state updates avatar scene
4. `useFrame` animation logic updates arm/body/movement transforms
5. UI shows detected action + explanation

---

## Setup Instructions

### 1) Clone repository

```bash
git clone https://github.com/matolengwe96/ai-3d-prototype.git
cd ai-3d-prototype
```

### 2) Install frontend dependencies

```bash
npm install
```

### 3) Configure frontend environment

Create `.env` in project root:

```bash
VITE_API_URL=https://ai-3d-backend-pou6.onrender.com
```

### 4) Run frontend

```bash
npm run dev
```

### 5) (Optional) Run backend locally

```bash
cd server
npm install
npm run dev
```

If running backend locally, set:

```bash
VITE_API_URL=http://localhost:3001
```

---

## Build and Quality Checks

From project root:

```bash
npm run build
```

---

## Example Commands

Prototype 1:
- `helmet`
- `safety vest`
- `gloves`
- `fire extinguisher`

Prototype 2:
- `wave hello`
- `point`
- `walk`
- `move forward`
- random text -> falls back to `idle`

---

## Limitations

- Prototype 1 currently uses a constrained training asset set (retrieval scope).
- Prototype 2 uses a primitive humanoid, not a rigged character + Mixamo clips.
- Command parser for Prototype 2 is deterministic and intentionally minimal.
- No persistent analytics/session logging yet.

---

## Next Steps

- Add image upload path for Prototype 1 and multimodal retrieval.
- Add GLB generation/conversion automation stage for broader object coverage.
- Replace primitive avatar with rigged model + animation blending.
- Expand command intent parser with LLM + safety constraints.
- Add evaluation metrics and telemetry for training outcomes.

---

## Repository Contents

- `src/App.jsx` - app shell and in-app prototype switcher
- `src/components/ModelViewer.jsx` - Prototype 1 3D viewer
- `src/pages/AvatarPrototype.jsx` - Prototype 2 command UI and parser
- `src/components/AvatarScene.jsx` - Prototype 2 avatar behavior scene
- `server/` - backend matching/summarization API
- `TECHNICAL_EXPLANATION.md` - 1-2 page architecture and engineering rationale

---

## Submission Notes

- Hosted demo includes both prototypes in a single app.
- Code is structured for fast iteration with minimal risk to existing flows.
- Focus is functional, stable MVP behavior aligned to assessment requirements.