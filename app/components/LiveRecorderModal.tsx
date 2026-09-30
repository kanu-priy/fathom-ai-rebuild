'use client';

import React, { useState, useEffect } from 'react';
import { Video, Square, Sparkles, Play } from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';
import { sounds } from '../lib/sounds';
import { speakTranscriptLine, stopSpeaking } from '../lib/speech';

interface LiveRecorderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveNewMeeting: (m: Meeting) => void;
}

export const LiveRecorderModal: React.FC<LiveRecorderModalProps> = ({ isOpen, onClose, onSaveNewMeeting }) => {
  const [stage, setStage] = useState<'setup' | 'recording' | 'processing'>('setup');
  const [title, setTitle] = useState('Quick Self-Call (Simulated)');
  const [platform, setPlatform] = useState<'Zoom' | 'Google Meet' | 'Microsoft Teams'>('Zoom');
  const [elapsed, setElapsed] = useState(0);
  const [lines, setLines] = useState<{ time: number; speaker: string; text: string }[]>([]);

  useEffect(() => {
    if (stage !== 'recording') return;
    const id = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(id);
  }, [stage]);

  useEffect(() => {
    if (stage !== 'recording') return;
    const script = [
      { time: 2, speaker: 'You', text: 'Starting our quick demo call for the Fathom rebuild project.' },
      { time: 8, speaker: 'Bot', text: 'Fathom Notetaker joined. Recording audio and video.' },
      { time: 14, speaker: 'You', text: 'Key milestone: 340ms transcription latency on 8-person multi-speaker sync.' },
      { time: 22, speaker: 'You', text: 'Action: Deploy to production and commit agent logs directory.' },
    ];
    const match = script.find(s => s.time === elapsed);
    if (match) {
      setLines(p => [...p, match]);
      sounds.notify();
      speakTranscriptLine(match.text, match.speaker === 'You' ? 'spk-1' : 'spk-2');
    }
  }, [elapsed, stage]);

  if (!isOpen) return null;

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;

  const startRecording = () => {
    sounds.recordStart();
    setStage('recording');
    setElapsed(0);
    setLines([]);
  };

  const endRecording = () => {
    stopSpeaking();
    sounds.recordStop();
    setStage('processing');
    setTimeout(() => {
      const mtg: Meeting = {
        id: `mtg-sim-${Date.now()}`, title, date: new Date().toISOString(),
        durationSeconds: Math.max(elapsed, 30), durationFormatted: `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`,
        platform, organizer: 'You', status: 'Recorded',
        tags: ['Simulated', 'Live Test'],
        videoThumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&auto=format&fit=crop&q=80',
        speakers: [{ id: 'you', name: 'You (Host)', role: 'Product Lead', avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', color: '#3b82f6', talkTimeSeconds: elapsed, talkPercentage: 100 }],
        transcript: lines.map((l, i) => ({
          id: `s-${i}`, speakerId: 'you', speakerName: l.speaker, speakerRole: 'Participant',
          speakerAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          speakerColor: '#3b82f6', startTime: l.time, endTime: l.time + 5, text: l.text,
        })),
        summaries: {
          executive: { id: 'executive', name: 'Executive Summary', icon: 'Crown', description: 'Auto-generated',
            overview: `Simulated call "${title}" recorded. Key milestones and action items captured in real-time.`,
            keyTakeaways: ['Live recording completed successfully.', 'Transcript captured and indexed.'],
            sections: [{ title: 'Call Notes', items: lines.map(l => `${l.speaker}: ${l.text}`) }],
          },
        },
        actionItems: [{ id: `a-${Date.now()}`, task: 'Deploy live build to production', assigneeName: 'You',
          assigneeAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
          dueDate: 'Today', completed: false, timestamp: 22, category: 'Engineering' }],
        clips: [],
      };
      onSaveNewMeeting(mtg);
      setStage('setup');
      onClose();
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-6" onClick={onClose}>
      <div className="bg-[#0f172a] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in" onClick={e => e.stopPropagation()}>
        {stage === 'setup' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <Video className="w-5 h-5 text-blue-400" />
              <h3 className="text-base font-bold text-white">Simulate Live Call</h3>
            </div>
            <p className="text-xs text-gray-400">Stubbed capture layer — tests the recording flow without a real call.</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">Meeting Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 p-2.5 rounded-lg focus:outline-none focus:border-blue-500/50" />
              </div>
              <div>
                <label className="text-[11px] text-gray-500 block mb-1">Platform</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Zoom', 'Google Meet', 'Microsoft Teams'] as const).map(p => (
                    <button key={p} onClick={() => setPlatform(p)} className={`py-2 rounded-lg text-xs font-semibold border transition-colors ${platform === p ? 'bg-blue-600 text-white border-blue-500' : 'bg-gray-900 text-gray-400 border-gray-800 hover:text-white'}`}>{p}</button>
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800/60">
              <button onClick={onClose} className="text-xs text-gray-400 hover:text-white px-3 py-2">Cancel</button>
              <button onClick={startRecording} className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"><Play className="w-3 h-3" /> Start Call</button>
            </div>
          </div>
        )}

        {stage === 'recording' && (
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="text-xs font-bold uppercase text-rose-400">Recording</span>
              </div>
              <span className="font-mono text-sm text-gray-200 font-bold">{fmt(elapsed)}</span>
            </div>
            {/* Waveform */}
            <div className="flex items-center justify-center gap-1.5 h-10 bg-gray-950 rounded-xl border border-gray-800 p-3">
              {[1,2,3,4,1,2,3].map((_, i) => <div key={i} className={`w-1 bg-blue-500 rounded-full animate-wave-${(i % 4) + 1}`} />)}
            </div>
            {/* Live Transcript */}
            <div className="bg-gray-950 rounded-xl border border-gray-800 p-3 h-32 overflow-y-auto space-y-1.5">
              {lines.map((l, i) => (
                <div key={i} className="text-xs flex gap-2">
                  <span className="text-gray-500 font-mono shrink-0">[{fmt(l.time)}]</span>
                  <span className="font-bold text-blue-400 shrink-0">{l.speaker}:</span>
                  <span className="text-gray-300">{l.text}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end">
              <button onClick={endRecording} className="text-xs font-bold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"><Square className="w-3 h-3" /> End & Generate Summary</button>
            </div>
          </div>
        )}

        {stage === 'processing' && (
          <div className="p-8 text-center space-y-3">
            <Sparkles className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
            <h3 className="text-sm font-bold text-gray-100">Generating meeting notes...</h3>
            <p className="text-xs text-gray-400">Extracting action items, key insights, and summaries</p>
          </div>
        )}
      </div>
    </div>
  );
};
