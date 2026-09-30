'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Search, Play, Copy, Share2, Sparkles, Check } from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';
import { sounds } from '../lib/sounds';

interface TranscriptViewProps {
  meeting: Meeting;
  currentTime: number;
  onSeek: (seconds: number) => void;
  onShareClip: (startTime: number, endTime: number) => void;
}

export const TranscriptView: React.FC<TranscriptViewProps> = ({ meeting, currentTime, onSeek, onShareClip }) => {
  const [search, setSearch] = useState('');
  const [speakerFilter, setSpeakerFilter] = useState('all');
  const [highlightFilter, setHighlightFilter] = useState('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const activeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [currentTime]);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const copyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    sounds.pop();
    setTimeout(() => setCopiedId(null), 2000);
  };

  const lines = meeting.transcript.filter(line => {
    if (search && !line.text.toLowerCase().includes(search.toLowerCase()) && !line.speakerName.toLowerCase().includes(search.toLowerCase())) return false;
    if (speakerFilter !== 'all' && line.speakerId !== speakerFilter) return false;
    if (highlightFilter === 'highlights_only' && !line.highlightType) return false;
    if (highlightFilter !== 'all' && highlightFilter !== 'highlights_only' && line.highlightType !== highlightFilter) return false;
    return true;
  });

  const badgeStyles: Record<string, { label: string; color: string }> = {
    insight: { label: '💡 Insight', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' },
    action: { label: '🎯 Action', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' },
    question: { label: '❓ Question', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' },
    risk: { label: '🚨 Risk', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
    bookmark: { label: '⭐ Bookmark', color: 'text-purple-300 bg-purple-500/10 border-purple-500/30' },
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      {/* Search & Filters */}
      <div className="p-3 border-b border-gray-800/60 space-y-2 shrink-0">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-gray-500 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search transcript..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-gray-900/80 border border-gray-800 text-sm text-gray-200 pl-9 pr-3 py-2 rounded-lg focus:outline-none focus:border-blue-500/50 transition-colors"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <button
            onClick={() => setSpeakerFilter('all')}
            className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${speakerFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200'}`}
          >All</button>
          {meeting.speakers.map(spk => (
            <button
              key={spk.id}
              onClick={() => setSpeakerFilter(spk.id)}
              className={`shrink-0 px-2 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${speakerFilter === spk.id ? 'bg-blue-600 text-white' : 'bg-gray-900 text-gray-400 border border-gray-800 hover:text-gray-200'}`}
            >
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: spk.color }} />
              {spk.name.split(' ')[0]}
            </button>
          ))}
          <select
            value={highlightFilter}
            onChange={e => setHighlightFilter(e.target.value)}
            className="shrink-0 ml-auto bg-gray-900 border border-gray-800 text-[11px] text-gray-300 rounded-md px-2 py-1 focus:outline-none"
          >
            <option value="all">All Lines</option>
            <option value="highlights_only">⭐ Highlights</option>
            <option value="insight">💡 Insights</option>
            <option value="action">🎯 Actions</option>
            <option value="question">❓ Questions</option>
            <option value="risk">🚨 Risks</option>
          </select>
        </div>
      </div>

      {/* Transcript Lines */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {lines.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-12">No matching lines found.</p>
        ) : lines.map(line => {
          const active = currentTime >= line.startTime && currentTime <= line.endTime;
          const badge = line.highlightType ? badgeStyles[line.highlightType] : null;
          return (
            <div
              key={line.id}
              ref={active ? activeRef : null}
              onClick={() => { onSeek(line.startTime); sounds.tick(); }}
              className={`p-3 rounded-xl border transition-all cursor-pointer group ${
                active
                  ? 'bg-blue-950/30 border-blue-500/50'
                  : 'bg-gray-900/30 border-gray-800/60 hover:bg-gray-800/40 hover:border-gray-700'
              }`}
            >
              {/* Speaker Row */}
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <img src={line.speakerAvatar} alt="" className="w-6 h-6 rounded-full object-cover ring-1" style={{ borderColor: line.speakerColor }} />
                  <span className="text-xs font-bold text-gray-200">{line.speakerName}</span>
                  <span className="text-[10px] text-gray-500 hidden sm:inline">{line.speakerRole}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {badge && (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold border ${badge.color}`}>{badge.label}</span>
                  )}
                  <span className="text-[11px] font-mono text-gray-500 group-hover:text-blue-400 flex items-center gap-0.5">
                    <Play className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100" />
                    {fmt(line.startTime)}
                  </span>
                </div>
              </div>

              {/* Text */}
              <p className="text-sm text-gray-300 leading-relaxed">{line.text}</p>

              {/* AI Note */}
              {line.highlightNote && (
                <div className="mt-2 p-2 rounded-lg bg-gray-950/60 border border-gray-800/60 text-[11px] text-blue-300 flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
                  {line.highlightNote}
                </div>
              )}

              {/* Hover Actions */}
              <div className="hidden group-hover:flex items-center gap-1 mt-2 pt-2 border-t border-gray-800/40">
                <button
                  onClick={e => { e.stopPropagation(); copyText(line.id, line.text); }}
                  className="text-[10px] text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded bg-gray-900"
                >
                  {copiedId === line.id ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Copy className="w-3 h-3" /> Copy</>}
                </button>
                <button
                  onClick={e => { e.stopPropagation(); onShareClip(line.startTime, line.endTime); }}
                  className="text-[10px] text-gray-400 hover:text-purple-300 flex items-center gap-1 px-2 py-1 rounded bg-gray-900"
                >
                  <Share2 className="w-3 h-3" /> Clip
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
