# AI 3D Asset Prototype

This project is an AI-powered interactive prototype built as part of the NexEra AI Engineering Challenge.

It demonstrates how natural language input can be transformed into interactive 3D training content, simulating how AI can support human learning environments.

---

## 🚀 Live Demo

Frontend (Vercel):  
👉 https://ai-3-d-prototype.vercel.app/

Backend (Render):  
👉 https://ai-3d-backend-pou6.onrender.com

---

## 🧠 Overview

This prototype allows users to:

1. Enter a natural language query (e.g., "safety vest")
2. Match the query to a relevant training asset
3. View the asset in an interactive 3D viewer
4. Receive an AI-generated educational summary
5. See reasoning for why the asset was selected

This simulates an AI-powered pipeline for generating training content in NexEra’s platform.

---

## 🧩 Features

- 🔎 Natural language search for training assets
- 🤖 AI-powered reasoning (with fallback logic)
- 🧠 Educational summaries for learning context
- 🧱 3D model rendering using Three.js
- 🎮 Interactive viewer (rotate, zoom, reset)
- 🌐 Full deployment (frontend + backend)

---

## 🏗️ Architecture

### Frontend
- React (Vite)
- Three.js via @react-three/fiber
- @react-three/drei for controls and helpers

### Backend
- Node.js (Express)
- OpenAI API (for semantic reasoning)
- Fallback keyword-based matcher

### Deployment
- Frontend: Vercel
- Backend: Render

---

## 🔁 System Flow

1. User enters a query  
2. Frontend sends request to backend  
3. Backend:
   - Attempts AI-based matching using OpenAI  
   - Falls back to keyword matching if AI fails  
4. Returns:
   - Matched asset  
   - Educational summary  
   - Reasoning  
5. Frontend renders:
   - Asset details  
   - AI output  
   - 3D model  

---

## 🧪 Example Queries

- "safety vest"  
- "gloves"  
- "fire extinguisher"  
- "helmet"  

---

## ⚙️ Setup Instructions

### 1. Clone the repo

```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO.git
cd YOUR-REPO