// CometX Bridge — Background Service Worker

const AGENT_WS_URL = 'ws://localhost:8001/ws/agent';
let agentSocket = null;

function connectToAgent() {
  agentSocket = new WebSocket(AGENT_WS_URL);

  agentSocket.onopen = () => {
    console.log('[CometX] Agent bridge connected');
  };

  agentSocket.onmessage = async (event) => {
    const action = JSON.parse(event.data);
    await executeAction(action);
  };

  agentSocket.onclose = () => {
    console.log('[CometX] Bridge disconnected. Reconnecting in 3s...');
    setTimeout(connectToAgent, 3000);
  };
}

async function executeAction(action) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  switch (action.action) {
    case 'navigate':
      await chrome.tabs.update(tab.id, { url: action.url });
      break;

    case 'click':
    case 'type':
    case 'scroll':
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: domAction,
        args: [action],
      });
      break;
  }
}

function domAction(action) {
  const el = action.selector ? document.querySelector(action.selector) : null;
  if (!el && action.action !== 'scroll') return;

  if (action.action === 'click') el.click();
  if (action.action === 'type') {
    el.focus();
    el.value = action.text || '';
    el.dispatchEvent(new Event('input', { bubbles: true }));
    if (action.submit) el.form?.submit();
  }
  if (action.action === 'scroll') {
    window.scrollBy(0, action.coordinates?.[1] || 300);
  }
}

connectToAgent();
