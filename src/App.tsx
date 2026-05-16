import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/core';
import NovaBar from './components/NovaBar/NovaBar';
import BrowserFrame from './components/BrowserFrame/BrowserFrame';
import './styles/nova.css';

export interface AgentState {
  status: 'idle' | 'thinking' | 'executing' | 'waiting_user';
  currentStep: string;
  actionHistory: string[];
}

export default function App() {
  const [url, setUrl] = useState('https://www.google.com');
  const [agentState, setAgentState] = useState<AgentState>({
    status: 'idle',
    currentStep: '',
    actionHistory: [],
  });

  const handleNavigate = async (newUrl: string) => {
    setUrl(newUrl);
    try {
      await invoke('navigate', { url: newUrl });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="cometx-root">
      <BrowserFrame
        url={url}
        onNavigate={handleNavigate}
        agentState={agentState}
      />
      <NovaBar
        agentState={agentState}
        onAgentStateChange={setAgentState}
        currentUrl={url}
      />
    </div>
  );
}
