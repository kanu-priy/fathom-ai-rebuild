'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play, Pause, Volume2, VolumeX, Lightbulb, CheckSquare,
  HelpCircle, AlertTriangle, FastForward, RotateCcw, Sparkles, Share2
} from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';
import { sounds } from '../lib/sounds';
import { speakTranscriptLine, stopSpeaking } from '../lib/speech';

interface VideoPlayerProps {
  meeting: Meeting;
  currentTime: number;
  onSeek: (seconds: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onAddHighlight: (type: 'insight' | 'action' | 'question' | 'risk' | 'bookmark', note?: string) => void;
  onShareClip: (startTime: number, endTime: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  meeting, currentTime, onSeek, isPlaying, onTogglePlay, onAddHighlight, onShareClip,
}) => {
  const [speed, setSpeed] = useState(1);
  const [muted, setMuted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const lastSpokenLineId = useRef<string | null>(null);

  // Playback timer
  useEffect(() => {
    if (!isPlaying) return;
    const id = setInterval(() => {
      onSeek(Math.min(meeting.durationSeconds, currentTime + speed));
    }, 1000);
    return () => clearInterval(id);
  }, [isPlaying, currentTime, speed, meeting.durationSeconds, onSeek]);

  const currentLine = meeting.transcript.find(t => currentTime >= t.startTime && currentTime <= t.endTime);
  const activeSpeaker = meeting.speakers.find(s => s.id === currentLine?.speakerId) || meeting.speakers[0];

  // Synchronized voice speech synthesis
  useEffect(() => {
    if (!isPlaying || muted) {
      stopSpeaking();
      lastSpokenLineId.current = null;
      return;
    }

    if (currentLine && currentLine.id !== lastSpokenLineId.current) {
      lastSpokenLineId.current = currentLine.id;
      speakTranscriptLine(currentLine.text, currentLine.speakerId, speed);
    }
  }, [isPlaying, muted, currentLine?.id, speed]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, []);

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const pct = (currentTime / meeting.durationSeconds) * 100;

  const scrub = (e: React.MouseEvent) => {
    if (!barRef.current) return;
    const r = barRef.current.getBoundingClientRect();
    onSeek(Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * meeting.durationSeconds);
  };

  const highlight = (type: 'insight' | 'action' | 'question' | 'risk') => {
    const labels = { insight: '💡 Insight', action: '🎯 Action', question: '❓ Question', risk: '🚨 Risk' };
    onAddHighlight(type, `${labels[type]} at ${fmt(currentTime)}`);
    setToast(`${labels[type]} saved at ${fmt(currentTime)}`);
    sounds.highlight();
    setTimeout(() => setToast(null), 2500);
  };

  return (
    <div className="flex flex-col bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      {/* Video Stage */}
      <div className="relative bg-gradient-to-br from-gray-950 via-slate-900 to-indigo-950 p-3">
        {/* Speaker Grid */}
        <div className={`grid gap-2 ${meeting.speakers.length <= 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {meeting.speakers.map((spk) => {
            const speaking = activeSpeaker?.id === spk.id && isPlaying;
            return (
              <div
                key={spk.id}
                onClick={() => {
                  const l = meeting.transcript.find(t => t.speakerId === spk.id);
                  if (l) onSeek(l.startTime);
                }}
                className={`relative flex flex-col items-center justify-center p-2 rounded-xl border cursor-pointer transition-all ${
                  speaking
                    ? 'border-blue-500/80 bg-blue-950/30 ring-1 ring-blue-500/40'
                    : 'border-gray-800/50 bg-gray-900/50 opacity-70 hover:opacity-100'
                }`}
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden ring-1 ring-gray-700 mb-1">
                  <img src={spk.avatar} alt={spk.name} className="w-full h-full object-cover" />
                  {speaking && (
                    <div className="absolute inset-0 bg-blue-600/20 flex items-center justify-center">
                      <div className="flex gap-0.5 items-end h-4">
                        <div className="w-0.5 bg-blue-400 animate-wave-1 rounded-full" />
                        <div className="w-0.5 bg-blue-400 animate-wave-2 rounded-full" />
                        <div className="w-0.5 bg-blue-400 animate-wave-3 rounded-full" />
                        <div className="w-0.5 bg-blue-400 animate-wave-4 rounded-full" />
                      </div>
                    </div>
                  )}
                </div>
                <p className="text-[10px] font-semibold text-gray-200 truncate w-full text-center">{spk.name.split(' ')[0]}</p>
                <p className="text-[8px] text-gray-500 truncate w-full text-center">{spk.role.split('(')[0].trim()}</p>
              </div>
            );
          })}
        </div>

        {/* Caption Overlay */}
        {currentLine && (
          <div className="mt-2 bg-gray-950/90 border border-gray-800 rounded-xl p-3">
            <div className="flex items-center gap-2 mb-1">
              <img src={activeSpeaker?.avatar} alt="" className="w-5 h-5 rounded-full object-cover ring-1 ring-blue-500" />
              <span className="text-[11px] font-bold text-blue-400">{activeSpeaker?.name}</span>
              <span className="text-[10px] text-gray-500 ml-auto font-mono">{fmt(currentTime)}</span>
            </div>
            <p className="text-xs text-gray-200 leading-relaxed line-clamp-2">"{currentLine.text}"</p>
          </div>
        )}

        {/* Toast */}
        {toast && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-xl animate-fade-in z-20">
            {toast}
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="px-4 pt-3 pb-1">
        <div
          ref={barRef}
          onClick={scrub}
          className="relative h-2 bg-gray-800 rounded-full cursor-pointer group"
        >
          <div className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" style={{ width: `${pct}%` }} />
          {/* Highlight markers */}
          {meeting.transcript.filter(l => l.highlightType).map(l => {
            const colors: Record<string, string> = { insight: 'bg-blue-400', action: 'bg-emerald-400', question: 'bg-amber-400', risk: 'bg-rose-400', bookmark: 'bg-purple-400' };
            return (
              <div
                key={l.id}
                style={{ left: `${(l.startTime / meeting.durationSeconds) * 100}%` }}
                className={`absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full ${colors[l.highlightType!]} ring-1 ring-black z-10`}
                title={l.highlightNote || ''}
              />
            );
          })}
        </div>
      </div>

      {/* Controls */}
      <div className="px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button onClick={() => { onTogglePlay(); sounds.click(); }} className="w-9 h-9 rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center transition-colors">
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>
          <button onClick={() => { onSeek(Math.max(0, currentTime - 10)); sounds.tick(); }} className="p-1.5 text-gray-400 hover:text-white"><RotateCcw className="w-3.5 h-3.5" /></button>
          <button onClick={() => { onSeek(Math.min(meeting.durationSeconds, currentTime + 10)); sounds.tick(); }} className="p-1.5 text-gray-400 hover:text-white"><FastForward className="w-3.5 h-3.5" /></button>
          <span className="text-xs font-mono text-gray-300 ml-1">
            <span className="text-blue-400">{fmt(currentTime)}</span>
            <span className="text-gray-600"> / </span>
            <span className="text-gray-500">{meeting.durationFormatted}</span>
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="flex bg-gray-900 rounded-lg border border-gray-800 p-0.5">
            {[0.75, 1, 1.5, 2].map(s => (
              <button key={s} onClick={() => setSpeed(s)} className={`px-2 py-0.5 rounded text-[11px] font-bold ${speed === s ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'}`}>{s}x</button>
            ))}
          </div>
          <button
            onClick={() => {
              const nextMuted = !muted;
              setMuted(nextMuted);
              if (nextMuted) {
                stopSpeaking();
                sounds.pop();
              } else {
                sounds.tick();
                if (isPlaying && currentLine) {
                  lastSpokenLineId.current = currentLine.id;
                  speakTranscriptLine(currentLine.text, currentLine.speakerId, speed);
                }
              }
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-xs font-semibold transition-all ${
              !muted
                ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 shadow-sm'
                : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
            }`}
            title={muted ? 'Click to Unmute Voice Audio' : 'Click to Mute Voice Audio'}
          >
            {muted ? <VolumeX className="w-3.5 h-3.5 text-rose-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />}
            <span className="text-[10px] font-bold">{muted ? 'Muted' : 'Voice ON'}</span>
          </button>
        </div>
      </div>

      {/* Highlight Bar */}
      <div className="px-4 py-2.5 border-t border-gray-800/60 flex items-center gap-2 flex-wrap bg-gray-950/50">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mr-1">Highlight:</span>
        {([
          { type: 'insight' as const, label: '💡 Insight', cls: 'text-blue-400 border-blue-500/30 bg-blue-500/5 hover:bg-blue-500/15' },
          { type: 'action' as const, label: '🎯 Action', cls: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5 hover:bg-emerald-500/15' },
          { type: 'question' as const, label: '❓ Question', cls: 'text-amber-400 border-amber-500/30 bg-amber-500/5 hover:bg-amber-500/15' },
          { type: 'risk' as const, label: '🚨 Risk', cls: 'text-rose-400 border-rose-500/30 bg-rose-500/5 hover:bg-rose-500/15' },
        ]).map(h => (
          <button key={h.type} onClick={() => highlight(h.type)} className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-colors active:scale-95 ${h.cls}`}>{h.label}</button>
        ))}
        <button
          onClick={() => { onShareClip(Math.max(0, currentTime - 15), Math.min(meeting.durationSeconds, currentTime + 15)); sounds.pop(); }}
          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold border text-purple-300 border-purple-500/30 bg-purple-500/5 hover:bg-purple-500/15 transition-colors active:scale-95 ml-auto"
        >
          ✂️ Create Clip
        </button>
      </div>
    </div>
  );
};
