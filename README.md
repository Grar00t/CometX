# 🌐 CometX — Sovereign Agentic Browser

> Built by [GraTech](https://gratech.sa) · Designed for sovereign AI operations in the Kingdom of Saudi Arabia

![License](https://img.shields.io/badge/license-MIT-blue) ![Framework](https://img.shields.io/badge/framework-Tauri-orange) ![AI](https://img.shields.io/badge/AI-Llama%203.1%20405B-green) ![Status](https://img.shields.io/badge/status-Phase%201%20MVP-yellow)

---

## What is CometX?

CometX is not a browser with an AI chatbot bolted on. It is an **AI-native operating system for the web** — where a Large Action Model (LAM) perceives, reasons, and acts on web pages autonomously on behalf of the user.

Built on **Tauri + Rust** for performance, powered by **Meta Llama 3.1 405B** via Azure MaaS, and designed with a **Cyberpunk/Glassmorphism** UI aesthetic under the codename **Nova**.

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────┐
│           Layer 1: Presentation (Nova UI)        │
│     TypeScript · React · Glassmorphism CSS       │
├─────────────────────────────────────────────────┤
│        Layer 2: Application Logic (Tauri)        │
│      Rust Backend · Session Mgmt · Memory        │
├─────────────────────────────────────────────────┤
│     Layer 3: Smart Extension Bridge (CDP)        │
│   DOM Distiller · Vision Processor · Msg Bus     │
├─────────────────────────────────────────────────┤
│       Layer 4: Browser Engine (Chromium)         │
│        Blink · DevTools Protocol · CDP          │
└─────────────────────────────────────────────────┘
               ↕ Azure MaaS API
┌─────────────────────────────────────────────────┐
│        Cognitive Core: Llama 3.1 405B            │
│   Planner · DOM Distiller · OmniParser Vision   │
└─────────────────────────────────────────────────┘
```

---

## 🚀 Phase Roadmap

| Phase | Name | Duration | Focus |
|-------|------|----------|-------|
| 1 | Copilot MVP | Months 1–3 | Nova sidebar, summarization, Smart Fill |
| 2 | Agentic Beta | Months 4–6 | Autonomous tasks, Vision, Llama 405B |
| 3 | Sovereign Ecosystem | Months 7+ | Enterprise, Arabic fine-tuning, Mobile |

---

## 🧰 Tech Stack

| Layer | Technology |
|-------|------------|
| Desktop Shell | Tauri 2.x (Rust) |
| Frontend UI | React + TypeScript + Vite |
| Browser Engine | Chromium / WebView2 |
| AI Planner | Meta Llama 3.1 405B (Azure MaaS) |
| Vision | OmniParser / ViT |
| Backend API | FastAPI (Python) + WebSocket |
| Memory | ChromaDB (local vector store) |
| Infra | Azure East US 2 → Saudi Regions |

---

## 📁 Project Structure

```
CometX/
├── src-tauri/          # Rust backend (Tauri)
│   ├── src/
│   │   ├── main.rs
│   │   ├── browser.rs  # Chrome/WebView controller
│   │   ├── session.rs  # Session & cookie management
│   │   └── commands.rs # Tauri command handlers
│   └── Cargo.toml
├── src/                # React frontend (Nova UI)
│   ├── components/
│   │   ├── NovaBar/    # AI Sidecar
│   │   ├── BrowserFrame/
│   │   └── StateVisualization/
│   ├── App.tsx
│   └── main.tsx
├── agent/              # Python AI backend
│   ├── main.py         # FastAPI entry point
│   ├── planner.py      # Llama 3.1 405B orchestration
│   ├── vision.py       # OmniParser integration
│   ├── dom_distiller.py
│   └── memory.py       # ChromaDB vector store
├── extension/          # Browser extension (Bridge)
│   ├── manifest.json
│   ├── background.js
│   └── content.js
├── docs/
│   └── architecture.md
├── .env.example
├── package.json
└── README.md
```

---

## ⚡ Quick Start

```bash
# 1. Clone
git clone https://github.com/Grar00t/CometX.git
cd CometX

# 2. Install frontend deps
npm install

# 3. Install Python agent deps
cd agent && pip install -r requirements.txt

# 4. Copy env config
cp .env.example .env
# Add your Azure Llama 3.1 405B endpoint + key

# 5. Run dev mode
npm run tauri dev
```

---

## 🔐 Security Model

- **Prompt Injection Defense** — All DOM text sanitized before LLM ingestion
- **Human-in-the-Loop** — Financial/destructive actions require explicit user approval
- **Tauri Sandboxing** — AI processes isolated from OS filesystem
- **No Data Leakage** — All traffic routes through configured Azure regions

---

## 📜 License

MIT © 2026 [GraTech](https://gratech.sa) / Suliman Alshammari
