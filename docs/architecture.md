# CometX Architecture Deep Dive

See the full strategic blueprint in `Comet-Browser-Architecture-and-Launch-Plan.md`.

## Quick Reference

### 4-Layer Model
1. **Nova UI** — React + TypeScript, Glassmorphism/Cyberpunk aesthetic
2. **Tauri App Logic** — Rust backend, session management, resource arbitration
3. **Smart Extension Bridge** — CDP, DOM distillation, prompt injection defense
4. **Chromium Engine** — Blink, headed/headless modes

### AI Stack
- **Planner**: Meta Llama 3.1 405B via Azure MaaS (East US 2)
- **Vision**: OmniParser (Phase 2+)
- **Memory**: ChromaDB (local persistent)

### Security
- Prompt injection filtering in DOM distiller
- Human-in-the-loop for high-risk actions
- Tauri sandboxing (no arbitrary FS access)
- Azure data residency → Saudi regions (Phase 3)
