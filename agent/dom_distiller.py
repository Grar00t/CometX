"""CometX DOM Distiller — Semantic DOM parsing for token efficiency"""

from typing import Dict, List, Any

INTERACTIVE_TAGS = {"a", "button", "input", "select", "textarea", "form"}
PROMPT_INJECTION_PATTERNS = [
    "ignore previous instructions",
    "ignore all instructions",
    "forget your instructions",
    "you are now",
    "disregard",
]


class DOMDistiller:
    def distill(self, dom_snapshot: Dict) -> Dict:
        """Convert raw DOM to semantic map for LLM consumption."""
        if not dom_snapshot:
            return {"elements": [], "title": "", "url": ""}

        elements = self._extract_interactive(dom_snapshot)
        clean_elements = self._sanitize(elements)

        return {
            "title": dom_snapshot.get("title", ""),
            "url": dom_snapshot.get("url", ""),
            "elements": clean_elements[:50],  # Token limit: max 50 elements
        }

    def _extract_interactive(self, dom: Dict) -> List[Dict]:
        elements = []
        nodes = dom.get("nodes", [])
        for node in nodes:
            if node.get("tag", "").lower() in INTERACTIVE_TAGS:
                elements.append({
                    "tag": node.get("tag"),
                    "id": node.get("id", ""),
                    "label": node.get("text", "")[:100],  # Truncate long text
                    "type": node.get("type", ""),
                    "href": node.get("href", ""),
                })
        return elements

    def _sanitize(self, elements: List[Dict]) -> List[Dict]:
        """Remove prompt injection patterns from DOM content."""
        clean = []
        for el in elements:
            label = el.get("label", "").lower()
            if any(p in label for p in PROMPT_INJECTION_PATTERNS):
                continue  # Drop injected elements
            clean.append(el)
        return clean
