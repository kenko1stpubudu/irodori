# Irodori — Japanese for Life in Japan
## いろどり 生活の日本語

A mobile-first progressive web app for learning Japanese using the Irodori textbook series by the Japan Foundation.

### 📱 Mobile App — GitHub Pages

**Live URL:** `https://YOUR-USERNAME.github.io/irodori/`

---

### 📚 Books

| Book | Level | Lessons | Status |
|------|-------|---------|--------|
| Starter 入門 | A1 | 18 | ✅ Done |
| Elementary 1 初級1 | A2 (JFT-Basic) | 18 | 🔄 In Progress |
| Elementary 2 初級2 | A2+ | 18 | 📋 Planned |

---

### 🚀 Setup on GitHub Pages

1. Fork or push this repo to GitHub
2. Go to **Settings → Pages**
3. Source: **Deploy from branch** → `main` → `/root` (or `/docs`)
4. Your app will be live at `https://YOUR-USERNAME.github.io/irodori/`

### 📲 Install as App on Phone

**iOS Safari:**
1. Open the URL in Safari
2. Tap Share → "Add to Home Screen"

**Android Chrome:**
1. Open the URL in Chrome  
2. Tap menu → "Add to Home Screen" or "Install app"

---

### 🎵 Audio Files

Audio files (~246MB) are too large for GitHub free tier.

**Options:**
- Upload to **GitHub Releases** (up to 2GB per release)
- Use the included **Web Speech API TTS** (Japanese voice synthesis) — works offline
- Self-host on any CDN

Audio file naming convention: `audio/XX-NN.mp3`
- XX = lesson number (01-18)
- NN = track number within lesson

---

### 📁 File Structure

```
irodori/
├── index.html          ← Starter A1 (入門)
├── elementary1.html    ← Elementary 1 A2 (初級1) [coming]
├── css/
│   └── style.css       ← Shared mobile-first styles
├── js/
│   └── app.js          ← Shared utilities (Audio TTS, Progress, Exercises)
├── data/
│   ├── starter.js      ← A1 lesson data (18 lessons)
│   └── elementary1.js  ← A2 lesson data (18 lessons) [coming]
└── audio/              ← Optional MP3 files (place here or use CDN)
    ├── 01-01.mp3
    └── ...
```

---

### ✨ Features

- 📖 All 18 Starter A1 lessons with full content
- 🎯 Can-do goals per lesson
- 💬 Key phrases with audio (TTS)
- 漢 Kanji words with pronunciation
- 📖 Grammar notes with examples  
- ✍️ Practice exercises (matching, fill-in)
- 🖊️ Stroke order diagrams
- 🧠 Review mode (random questions from all lessons)
- ✓ Progress tracking (localStorage)
- 📱 Installable as PWA (works offline after first load)

---

Source: いろどり 生活の日本語 (Irodori: Japanese for Life in Japan)  
© The Japan Foundation. Educational use only.
