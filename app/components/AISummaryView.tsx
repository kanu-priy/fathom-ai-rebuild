'use client';

import React, { useState } from 'react';
import { Sparkles, Crown, Copy, Check, RefreshCw, Send, FileText } from 'lucide-react';
import { Meeting, AISummaryTemplate } from '../data/sampleMeetings';
import { sounds } from '../lib/sounds';

interface AISummaryViewProps {
  meeting: Meeting;
  onSeek: (seconds: number) => void;
}

export const AISummaryView: React.FC<AISummaryViewProps> = ({ meeting }) => {
  const keys = Object.keys(meeting.summaries);
  const [activeKey, setActiveKey] = useState(keys[0] || 'executive');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  const tmpl: AISummaryTemplate = meeting.summaries[activeKey] || {
    id: 'default', name: 'Summary', icon: 'Crown', description: '',
    overview: 'Meeting summary.', keyTakeaways: [], sections: [],
  };

  const copySummary = () => {
    const text = `# ${tmpl.name}\n\n${tmpl.overview}\n\n## Key Takeaways\n${tmpl.keyTakeaways.map(k => `- ${k}`).join('\n')}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    sounds.pop();
    setTimeout(() => setCopied(false), 2000);
  };

  const submitPrompt = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customPrompt.trim()) return;
    setGenerating(true);
    sounds.pop();
    setTimeout(() => { setGenerating(false); setCustomPrompt(''); }, 1500);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-800/60 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-400" />
          <select
            value={activeKey}
            onChange={e => setActiveKey(e.target.value)}
            className="bg-gray-900 border border-gray-800 text-sm font-semibold text-blue-400 rounded-lg px-2.5 py-1.5 focus:outline-none"
          >
            {keys.map(k => <option key={k} value={k}>{meeting.summaries[k].name}</option>)}
          </select>
        </div>
        <button onClick={copySummary} className="flex items-center gap-1 bg-gray-900 border border-gray-800 text-gray-300 hover:text-white px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Overview */}
        <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20">
          <h3 className="text-[11px] font-bold uppercase tracking-wider text-blue-400 mb-1.5 flex items-center gap-1.5">
            <Crown className="w-3.5 h-3.5 text-amber-400" /> Overview
          </h3>
          <p className="text-sm text-gray-200 leading-relaxed">{tmpl.overview}</p>
        </div>

        {/* Key Takeaways */}
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            <Sparkles className="w-3 h-3 text-blue-400" /> Key Takeaways ({tmpl.keyTakeaways.length})
          </h4>
          <ul className="space-y-2">
            {tmpl.keyTakeaways.map((t, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm text-gray-200">
                <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <span className="leading-relaxed">{t}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Sections */}
        {tmpl.sections.map((sec, i) => (
          <div key={i} className="space-y-2">
            <h4 className="text-sm font-semibold text-gray-100 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" /> {sec.title}
            </h4>
            <ul className="space-y-1.5">
              {sec.items.map((item, j) => (
                <li key={j} className="flex items-start gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-2" />
                  <span className="leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Custom Prompt */}
        <div className="p-3 rounded-xl bg-gray-950/80 border border-gray-800/60 space-y-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> Custom AI Summary
          </p>
          <form onSubmit={submitPrompt} className="flex gap-2">
            <input
              type="text"
              placeholder="e.g. 'Summarize risks for the CTO'..."
              value={customPrompt}
              onChange={e => setCustomPrompt(e.target.value)}
              className="flex-1 bg-gray-900 border border-gray-800 text-sm text-gray-200 px-3 py-2 rounded-lg focus:outline-none focus:border-blue-500/50"
            />
            <button type="submit" disabled={generating} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
              {generating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <><Send className="w-3 h-3" /> Go</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
