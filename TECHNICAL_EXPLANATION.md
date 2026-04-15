# Technical Explanation (NexEra AI Engineering Challenge)

## 1) What I Built

I built two interactive prototypes inside one React + Vite application:

1. **Prototype 1: AI-assisted 3D training asset pipeline (retrieval-first)**
   - Accepts natural language object queries.
   - Sends query to a backend service for asset matching and educational summary generation.
   - Displays matched 3D GLB content in an interactive Three.js viewer.

2. **Prototype 2: Natural language -> avatar behavior**
   - Accepts command text (for example: "wave hello", "point", "walk").
   - Interprets command text to a behavior state.
   - Plays visible avatar behavior in a 3D scene and displays short explanation text.

Both prototypes are intentionally MVP-scoped to maximize reliability, speed, and demo readiness.

---

## 2) Why I Chose This Approach

The challenge asks for functional, hosted, AI-driven interactive prototypes rather than production polish. I optimized for:

- **Speed:** Reused existing app architecture and added Prototype 2 within the same codebase.
- **Stability:** Avoided risky full-router refactors by using an in-app prototype switcher.
- **Low implementation risk:** Used a primitive-shape humanoid avatar instead of full rigging to ensure predictable delivery.
- **Submission readiness:** Prioritized deterministic behavior, clear UX feedback, and deployability.

For Prototype 1, retrieval with AI-assisted matching is a practical and reliable base pattern for educational asset pipelines.  
For Prototype 2, deterministic command mapping provides transparent and testable behavior while leaving a clear path to LLM-based intent expansion.

---

## 3) Architecture and AI Logic

## Frontend

- React state drives UI and scene behavior.
- Three.js rendering is implemented via `@react-three/fiber` and `@react-three/drei`.
- User can switch between prototypes from a shared app shell.

## Prototype 1 pipeline

1. User submits a text query.
2. Frontend sends request to backend endpoint (`/api/match-asset`).
3. Backend performs AI-assisted semantic matching (with fallback keyword matching).
4. Backend returns:
   - matched asset metadata
   - educational summary
   - match reasoning
5. Frontend renders metadata cards and loads corresponding GLB model in viewer.

Viewer behavior:
- Orbit controls for rotate/zoom.
- Reset camera utility.
- Model-centric presentation with basic lighting and shadow support.

## Prototype 2 pipeline

1. User submits command text.
2. Frontend parser converts text to one of four actions:
   - `wave`
   - `point`
   - `walk`
   - `idle` (fallback)
3. Action updates avatar animation state and explanation label.
4. 3D avatar behavior is animated in render loop (`useFrame`) by changing transforms.

Command mapping logic:
- Contains "wave" -> `wave`
- Contains "point" -> `point`
- Contains "walk" or "move" -> `walk`
- Else -> `idle`

Behavior implementation:
- **Wave:** right arm raised and oscillating.
- **Point:** right arm extended forward with stable posture.
- **Walk:** avatar translates laterally with arm swing and subtle bounce.
- **Idle:** neutral standing posture.

Scene implementation:
- Canvas + ambient and directional lights.
- Ground plane.
- OrbitControls.
- Reset camera button.

---

## 4) Challenges and How I Solved Them

### Challenge A: Add Prototype 2 without breaking Prototype 1
**Solution:** Added Prototype 2 inside existing app with a minimal switcher instead of introducing route-level complexity.

### Challenge B: Make avatar behavior visible quickly
**Solution:** Used primitive geometry (capsule/sphere/box) and direct transform animation in `useFrame`. This removed dependency on rigging pipelines while preserving clear behavior semantics.

### Challenge C: Keep command interpretation predictable
**Solution:** Implemented deterministic parsing. This keeps demo outcomes reproducible and easy to explain during evaluation.

### Challenge D: Time-bound delivery quality
**Solution:** Prioritized core interaction loop, camera controls, and explanation text over non-essential visual polish.

---

## 5) Limitations

- Prototype 1 is retrieval-focused with a constrained asset set, not full text/image-to-3D generation.
- Prototype 2 does not yet use rigged skeletal animation clips (Mixamo/DeepMotion/Rokoko).
- Command understanding in Prototype 2 is rule-based and intentionally narrow.
- Limited telemetry and no formal model evaluation dashboard.

---

## 6) How This Scales in NexEra

## For Prototype 1

- Add multimodal ingestion: text + image embedding search.
- Introduce asset normalization pipeline: conversion, materials, auto-scaling, metadata enrichment.
- Build content quality scoring and confidence signals.
- Add educator workflow tooling for curation and approval.

## For Prototype 2

- Upgrade parser to LLM intent and slot extraction (`action`, `target`, `tone`, `safety`).
- Introduce behavior planner: command -> animation sequence graph.
- Integrate rigged avatars and blend-tree animation system.
- Add scenario context memory and learner-adaptive responses.

## Platform-wide

- Centralized prompt/version management and experiment tracking.
- Event instrumentation for learning outcome analytics.
- Safety and moderation layers for learner-facing avatar behavior.

---

## 7) Summary

This submission provides two hosted, interactive, AI-aligned prototypes with clear command-to-outcome loops:

- Prototype 1 demonstrates AI-assisted educational 3D asset discovery and presentation.
- Prototype 2 demonstrates natural language command interpretation into visible avatar behavior and explanatory feedback.

The implementation is intentionally minimal-risk and extensible, making it suitable as a foundation for deeper NexEra product integration.
