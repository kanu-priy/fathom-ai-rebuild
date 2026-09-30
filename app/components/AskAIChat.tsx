'use client';

import React, { useState } from 'react';
import { Send, Sparkles, Play, Bot, User } from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';
import { sounds } from '../lib/sounds';

interface ChatMsg { id: string; sender: 'user' | 'ai'; text: string; ts?: number; }

interface AskAIChatProps {
  meeting: Meeting;
  onSeek: (seconds: number) => void;
}

export const AskAIChat: React.FC<AskAIChatProps> = ({ meeting, onSeek }) => {
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { id: 'welcome', sender: 'ai', text: `I've analyzed "${meeting.title}". Ask me anything about what was discussed, decisions made, or action items!` },
  ]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const q = input.toLowerCase();
    setMsgs(p => [...p, { id: `u-${Date.now()}`, sender: 'user', text: input }]);
    sounds.pop();
    setInput('');
    setThinking(true);

    setTimeout(() => {
      let text = `Based on the meeting transcript, the team discussed key strategic priorities and technical milestones for Q4.`;
      let ts = meeting.transcript[1]?.startTime || 25;

      if (q.includes('security') || q.includes('compliance') || q.includes('gdpr')) {
        text = "Jordan Lee raised GDPR compliance requirements: Frankfurt data residency and 30-day KMS key rotation are mandatory for European enterprise pilots. Alex Rivera committed to provisioning an isolated AWS EU-Central-1 cluster by next Wednesday.";
        ts = 261;
      } else if (q.includes('budget') || q.includes('arr') || q.includes('revenue') || q.includes('sales') || q.includes('pipeline')) {
        text = "Marcus Brody confirmed 14 enterprise prospects are waiting on SOC2 Type II certification, representing approximately $1.4M in pipeline ARR. The November 15 launch date is critical to closing these deals before end of quarter.";
        ts = 25;
      } else if (q.includes('latency') || q.includes('technical') || q.includes('whisper') || q.includes('audio') || q.includes('engineer')) {
        text = "Alex Rivera shared that end-to-end transcription latency was benchmarked at 340ms across 8 simultaneous audio streams using Whisper Large v3 + Deepgram Nova-2. David Kim is implementing chunked GPU audio buffer pooling to reduce memory overhead by 40%.";
        ts = 66;
      } else if (q.includes('action') || q.includes('task') || q.includes('next step')) {
        text = "Key action items: (1) Alex Rivera — AWS Frankfurt cluster by Wednesday, (2) David Kim — GPU buffer pooling by Friday, (3) James Wright — Draft TechCrunch launch campaign copy, (4) Jordan Lee — Finalize SOC2 audit documentation.";
        ts = 411;
      } else if (q.includes('design') || q.includes('ux') || q.includes('ui')) {
        text = "Priya Patel shared that the redesigned multi-speaker transcript view with color-coded speaker badges raised user satisfaction from 68% to 94% in enterprise pilot testing with 12 user calls.";
        ts = 166;
      }

      setMsgs(p => [...p, { id: `a-${Date.now()}`, sender: 'ai', text, ts }]);
      sounds.notify();
      setThinking(false);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-800/60 flex items-center gap-2 shrink-0">
        <Bot className="w-4 h-4 text-purple-400" />
        <h3 className="text-sm font-bold text-gray-100">Ask Fathom AI</h3>
        <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">Grounded in Transcript</span>
      </div>

      {/* Suggested Prompts */}
      <div className="px-3 py-2 border-b border-gray-800/40 flex gap-1.5 overflow-x-auto shrink-0">
        {['What are the key action items?', 'What are the security risks?', 'What is the ARR impact?'].map((p, i) => (
          <button key={i} onClick={() => setInput(p)} className="shrink-0 px-2.5 py-1 rounded-lg bg-gray-900 border border-gray-800 text-[10px] text-gray-400 hover:text-white hover:border-purple-500/30 transition-colors">{p}</button>
        ))}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {msgs.map(msg => (
          <div key={msg.id} className={`flex gap-2.5 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${msg.sender === 'user' ? 'bg-blue-600' : 'bg-purple-600'}`}>
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
            </div>
            <div className={`max-w-[80%] p-3 rounded-xl border space-y-1.5 ${msg.sender === 'user' ? 'bg-blue-600/15 border-blue-500/30' : 'bg-gray-900/50 border-gray-800/60'}`}>
              <p className="text-sm text-gray-200 leading-relaxed">{msg.text}</p>
              {msg.ts !== undefined && (
                <button onClick={() => { onSeek(msg.ts!); sounds.tick(); }} className="flex items-center gap-1 bg-purple-500/15 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-lg text-[10px] font-mono font-bold transition-colors hover:bg-purple-500/25 mt-1">
                  <Play className="w-2.5 h-2.5 fill-current" /> Jump to {fmt(msg.ts!)}
                </button>
              )}
            </div>
          </div>
        ))}
        {thinking && (
          <div className="flex items-center gap-2 text-xs text-purple-400 p-2">
            <Sparkles className="w-3.5 h-3.5 animate-spin" /> Searching transcript...
          </div>
        )}
      </div>

      {/* Input */}
      <form onSubmit={send} className="p-3 border-t border-gray-800/60 flex gap-2 shrink-0">
        <input
          type="text"
          placeholder="Ask about this meeting..."
          value={input}
          onChange={e => setInput(e.target.value)}
          className="flex-1 bg-gray-900 border border-gray-800 text-sm text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-purple-500/50"
        />
        <button type="submit" className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
          <Send className="w-3 h-3" /> Ask
        </button>
      </form>
    </div>
  );
};
