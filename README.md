# ⚔️ AI Debate Simulator

A web app where two AI models — **Google Gemini** and **Meta Llama** — debate each other on any topic you choose. Built with **React 18** + **Vite**.

## ✨ Features

- 🤖 Two real AI models debating: **Gemini** (Google) vs **Llama** (Meta via Groq)
- 🎯 Choose who goes **Pro** and who goes **Against**
- 🔄 Customizable rounds (1–5)
- 🌐 Bilingual support — **English** and **Indonesian**
- 📝 Add context or constraints to guide the debate
- 💬 Chat-style UI with arguments displayed per round
- ⚡ Fast and lightweight with Vite

## 🛠️ Tech Stack

- **React 18**
- **Vite**
- **Google Gemini AI** (`@google/generative-ai`) — Model: `gemini-2.5-flash`
- **Groq SDK** (`groq-sdk`) — Model: `llama-3.1-8b-instant`
- **Bootstrap Icons**

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/username/ai-debate-simulator.git
cd ai-debate-simulator
```

### 2. Install dependencies

```bash
npm install
```

### 3. Get your API Keys

**Gemini API Key:**
1. Go to [Google AI Studio](https://aistudio.google.com)
2. Sign in with your Google account
3. Click **"Get API Key"** → **"Create API Key"**
4. Copy your API key

**Groq API Key:**
1. Go to [Groq Console](https://console.groq.com)
2. Sign in / Sign up
3. Click **"API Keys"** → **"Create API Key"**
4. Copy your API key

### 4. Setup environment variables

Create a `.env` file in the root directory:

```env
VITE_GEMINI_KEY=your_gemini_api_key_here
VITE_GROQ_KEY=your_groq_api_key_here
```


### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## 📁 Project Structure

```
src/
├── components/
│   ├── DebateForm.jsx       # Input form (topic, context, rounds, stance, language)
│   ├── DebateArena.jsx      # Displays debate messages per round
│   ├── DebateMessage.jsx    # Individual argument bubble
│   └── LoadingDots.jsx      # Animated loading indicator
├── hooks/
│   └── useDebate.js         # Gemini & Groq API logic
├── App.jsx
└── index.css
```

## 🎮 How to Use

1. Enter a **debate topic**
2. Add optional **context** to guide the debate
3. Select number of **rounds** (1–5)
4. Choose the **language** (English / Indonesian)
5. Pick which AI goes **Pro** and which goes **Against**
6. Click **Start Debate** and watch them argue! 🔥

## 🔒 Environment Variables

| Variable | Description |
|---|---|
| `VITE_GEMINI_KEY` | Google Gemini API Key |
| `VITE_GROQ_KEY` | Groq API Key (for Llama) |

## 📄 License

MIT License © 2026