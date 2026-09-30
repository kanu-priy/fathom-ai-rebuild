'use client';

import React, { useState } from 'react';
import { Scissors, Share2, Copy, Check, Play } from 'lucide-react';
import { Clip } from '../data/sampleMeetings';

interface ClipsModalProps { clips: Clip[]; onSeek: (s: number) => void; }

export const ClipsModal: React.FC<ClipsModalProps> = ({ clips, onSeek }) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const copyLink = (clip: Clip) => {
    navigator.clipboard.writeText(clip.sharedUrl);
    setCopiedId(clip.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      <div className="p-3 border-b border-gray-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Scissors className="w-4 h-4 text-purple-400" />
          <h3 className="text-sm font-bold text-gray-100">Clips & Highlights</h3>
        </div>
        <span className="text-[11px] text-gray-500">{clips.length} clips</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {clips.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-12">No clips yet. Create one from the transcript or video player!</p>
        ) : clips.map(clip => (
          <div key={clip.id} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/60 hover:border-purple-500/30 transition-colors space-y-3">
            <div className="flex items-start justify-between gap-2">
              <h4 className="text-sm font-semibold text-gray-100">{clip.title}</h4>
              <button onClick={() => onSeek(clip.startTime)} className="shrink-0 flex items-center gap-1 bg-purple-600/15 text-purple-300 border border-purple-500/30 px-2 py-1 rounded-lg text-[11px] font-mono font-bold hover:bg-purple-600/25 transition-colors">
                <Play className="w-2.5 h-2.5 fill-current" />{fmt(clip.startTime)} - {fmt(clip.endTime)}
              </button>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {clip.tags.map((t, i) => <span key={i} className="px-1.5 py-0.5 rounded text-[9px] font-semibold bg-gray-800 text-gray-400">#{t}</span>)}
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-800/40 text-[11px]">
              <div className="flex items-center gap-1.5">
                <img src={clip.creatorAvatar} alt="" className="w-4 h-4 rounded-full object-cover" />
                <span className="text-gray-500">{clip.creatorName}</span>
              </div>
              <button onClick={() => copyLink(clip)} className="flex items-center gap-1 bg-gray-800 hover:bg-gray-700 text-gray-300 px-2.5 py-1 rounded-lg font-medium transition-colors">
                {copiedId === clip.id ? <><Check className="w-3 h-3 text-emerald-400" /> Copied</> : <><Share2 className="w-3 h-3" /> Copy Link</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
