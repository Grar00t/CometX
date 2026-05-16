import { useState } from 'react';
import type { AgentState } from '../../App';
import './BrowserFrame.css';

interface BrowserFrameProps {
  url: string;
  onNavigate: (url: string) => void;
  agentState: AgentState;
}

export default function BrowserFrame({ url, onNavigate, agentState }: BrowserFrameProps) {
  const [addressInput, setAddressInput] = useState(url);

  const handleGo = () => {
    let target = addressInput;
    if (!target.startsWith('http')) target = 'https://' + target;
    onNavigate(target);
  };

  return (
    <main className="browser-frame" data-agent={agentState.status}>
      <div className="browser-toolbar">
        <button className="nav-btn" onClick={() => history.back()}>←</button>
        <button className="nav-btn" onClick={() => history.forward()}>→</button>
        <button className="nav-btn" onClick={() => onNavigate(url)}>↻</button>
        <input
          className="address-bar"
          value={addressInput}
          onChange={e => setAddressInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleGo()}
          placeholder="Search or enter URL..."
        />
        <div className="agent-indicator" data-status={agentState.status}>
          {agentState.status !== 'idle' && '⚡'}
        </div>
      </div>
      <webview
        src={url}
        className="webview"
        allowpopups
      />
    </main>
  );
}
