'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Play, Mic } from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  meetings: Meeting[];
  onSelectSearchResult: (meetingId: string, timestamp?: number) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({ isOpen, onClose, meetings, onSelectSearchResult }) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); }
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const results: { meetingId: string; meetingTitle: string; line: string; speaker: string; ts: number }[] = [];
  if (query.trim()) {
    const q = query.toLowerCase();
    for (const m of meetings) {
      for (const l of m.transcript) {
        if (l.text.toLowerCase().includes(q) || l.speakerName.toLowerCase().includes(q)) {
          results.push({ meetingId: m.id, meetingTitle: m.title, line: l.text, speaker: l.speakerName, ts: l.startTime });
        }
      }
    }
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-start justify-center pt-24 p-6" onClick={onClose}>
      <div className="bg-[#0f172a] border border-gray-800 rounded-2xl w-full max-w-xl shadow-2xl flex flex-col max-h-[70vh] animate-fade-in" onClick={e => e.stopPropagation()}>
        {/* Search Input */}
        <div className="p-3 border-b border-gray-800/60 flex items-center gap-2.5 shrink-0">
          <Search className="w-4 h-4 text-blue-400 shrink-0" />
          <input
            type="text" autoFocus placeholder="Search across all meetings..."
            value={query} onChange={e => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-500 focus:outline-none"
          />
          <button onClick={onClose} className="text-gray-500 hover:text-white"><X className="w-4 h-4" /></button>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {!query.trim() ? (
            <div className="py-10 text-center space-y-1">
              <Search className="w-6 h-6 text-gray-700 mx-auto" />
              <p className="text-sm text-gray-500">Try "latency", "budget", "GDPR", or a speaker name</p>
            </div>
          ) : results.length === 0 ? (
            <p className="text-center text-gray-500 text-sm py-10">No results for "{query}"</p>
          ) : results.map((r, i) => (
            <button key={i} onClick={() => { onSelectSearchResult(r.meetingId, r.ts); onClose(); }}
              className="w-full text-left p-3 rounded-xl bg-gray-900/40 border border-gray-800/60 hover:bg-gray-800/40 hover:border-blue-500/30 transition-colors space-y-1 group"
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-bold text-blue-400 flex items-center gap-1 truncate"><Mic className="w-3 h-3 shrink-0" />{r.meetingTitle}</span>
                <span className="font-mono text-gray-500 group-hover:text-blue-400 flex items-center gap-0.5 shrink-0"><Play className="w-2.5 h-2.5 fill-current" />{fmt(r.ts)}</span>
              </div>
              <p className="text-sm text-gray-300 truncate"><span className="font-semibold text-gray-200">{r.speaker}:</span> "{r.line}"</p>
            </button>
          ))}
        </div>

        <div className="p-2.5 border-t border-gray-800/60 flex items-center justify-between text-[10px] text-gray-500 shrink-0">
          <span>Press <kbd className="px-1 py-0.5 bg-gray-800 rounded border border-gray-700">ESC</kbd> to close</span>
          <span className="text-blue-400 font-semibold">{results.length} results</span>
        </div>
      </div>
    </div>
  );
};
