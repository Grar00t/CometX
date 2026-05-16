// CometX Content Script — DOM Distiller

function distillDOM() {
  const interactiveTags = ['a', 'button', 'input', 'select', 'textarea'];
  const elements = [];

  interactiveTags.forEach(tag => {
    document.querySelectorAll(tag).forEach((el, idx) => {
      elements.push({
        tag,
        id: el.id || '',
        label: (el.textContent || el.value || el.placeholder || el.getAttribute('aria-label') || '').trim().slice(0, 100),
        type: el.type || '',
        href: el.href || '',
        index: idx,
      });
    });
  });

  return {
    url: window.location.href,
    title: document.title,
    nodes: elements.slice(0, 50),
  };
}

// Send DOM snapshot when requested
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'GET_DOM') {
    sendResponse(distillDOM());
  }
});
