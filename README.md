# AI 3D Asset Prototype

This project is an AI-powered interactive prototype that converts user input into 3D training content.

## 🚀 Features

- Text-based object search (e.g. "hard hat")
- AI-style asset matching
- Educational summaries
- Interactive 3D viewer (Three.js)

## 🧠 Architecture

Frontend:
- React (Vite)
- Three.js (React Three Fiber)

Pipeline:
User Input → Matching Logic → Asset Selection → 3D Viewer → Summary

## 📦 Project Structure

```
src/
  components/
  data/
  utils/
public/
  models/
```

## ⚙️ Setup

```bash
npm install
npm run dev
```

## 📌 Current Status

- MVP search and UI working
- 3D viewer placeholder added
- Next: integrate real AI + 3D asset pipeline

## 🔮 Future Improvements

- LLM-powered semantic matching
- Image → 3D asset pipeline
- External asset APIs (Sketchfab / Objaverse)
- Real 3D model preprocessing