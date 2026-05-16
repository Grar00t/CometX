import { useState, useRef, useEffect } from 'react';
import type { AgentState } from '../../App';
import './NovaBar.css';

interface NovaBarProps {
  agentState: AgentState;
  onAgentStateChange: (state: AgentState) => void;
  currentUrl: string;
}

interface Message {
  role: 'user' | 'nova';
  content: string;
  timestamp: Date;
}

export default function NovaBar({ agentState, onAgentStateChange, currentUrl }: NovaBarProps) {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'nova',
      content: '🌐 Nova active. What do you want me to do?',
      timestamp: new Date(),
    },
  ]);
  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Connect to CometX agent backend
    wsRef.current = new WebSocket('ws://localhost:8001/ws/agent');
    wsRef.current.onmessage = (event) => {
      const action = JSON.parse(event.data);
      handleAgentAction(action);
    };
    return () => wsRef.current?.close();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendIntent = () => {
    if (!input.trim() || !wsRef.current) return;

    const msg: Message = { role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, msg]);

    onAgentStateChange({ ...agentState, status: 'thinking', currentStep: 'Planning...' });

    wsRef.current.send(JSON.stringify({
      intent: input,
      url: currentUrl,
      dom: {},
      screenshot: '',
    }));

    setInput('');
  };

  const handleAgentAction = (action: any) => {
    if (action.risk_level === 'high') {
      onAgentStateChange({ ...agentState, status: 'waiting_user', currentStep: action.reasoning });
      setMessages(prev => [...prev, {
        role: 'nova',
        content: `⚠️ High-risk action detected: "${action.reasoning}"\n\nConfirm to proceed?`,
        timestamp: new Date(),
      }]);
    } else {
      onAgentStateChange({ ...agentState, status: 'executing', currentStep: action.reasoning || '' });
      setMessages(prev => [...prev, {
        role: 'nova',
        content: `→ ${action.action}: ${action.reasoning || JSON.stringify(action)}`,
        timestamp: new Date(),
      }]);
      setTimeout(() => onAgentStateChange({ ...agentState, status: 'idle', currentStep: '' }), 1500);
    }
  };

  return (
    <aside className="nova-bar">
      <div className="nova-header">
        <span className="nova-dot" data-status={agentState.status} />
        <span className="nova-title">Nova</span>
        <span className="nova-status-text">{agentState.status}</span>
      </div>

      {agentState.currentStep && (
        <div className="nova-step">{agentState.currentStep}</div>
      )}

      <div className="nova-messages">
        {messages.map((m, i) => (
          <div key={i} className={`nova-message nova-message--${m.role}`}>
            {m.content}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="nova-input-row">
        <input
          className="nova-input"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendIntent()}
          placeholder="Tell Nova what to do..."
        />
        <button className="nova-send" onClick={sendIntent}>⚡</button>
      </div>
    </aside>
  );
}
