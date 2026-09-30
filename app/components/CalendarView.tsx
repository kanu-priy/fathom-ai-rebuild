'use client';

import React, { useState } from 'react';
import { Calendar, Video, Clock, Users, ShieldCheck } from 'lucide-react';
import { UPCOMING_MEETINGS } from '../data/sampleMeetings';

interface CalendarViewProps { onOpenLiveRecorder: () => void; }

export const CalendarView: React.FC<CalendarViewProps> = ({ onOpenLiveRecorder }) => {
  const [upcoming, setUpcoming] = useState(UPCOMING_MEETINGS);

  const toggleBot = (id: string) => {
    setUpcoming(p => p.map(m => m.id === id ? { ...m, botStatus: m.botStatus === 'Joining Auto' ? 'Disabled' : 'Joining Auto' } : m));
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      <div className="p-3 border-b border-gray-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-100">Upcoming Meetings</h3>
          <span className="text-[11px] text-gray-500">Google Calendar synced</span>
        </div>
        <button onClick={onOpenLiveRecorder} className="flex items-center gap-1 bg-blue-600 hover:bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors">
          <Video className="w-3 h-3" /> Instant Call
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {upcoming.map(item => (
          <div key={item.id} className="p-4 rounded-xl bg-gray-900/40 border border-gray-800/60 flex items-center justify-between gap-4 hover:bg-gray-800/40 transition-colors">
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-gray-100 truncate">{item.title}</h4>
              <div className="flex items-center gap-3 text-[11px] text-gray-500 mt-1">
                <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-blue-400" />{item.time} ({item.duration})</span>
                <span className="flex items-center gap-1"><Users className="w-3 h-3" />{item.attendeesCount}</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] font-semibold">{item.platform}</span>
              </div>
            </div>
            <button onClick={() => toggleBot(item.id)} className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 border transition-colors ${
              item.botStatus === 'Joining Auto' ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' : 'bg-gray-800 text-gray-500 border-gray-700'
            }`}>
              <ShieldCheck className="w-3 h-3" />{item.botStatus === 'Joining Auto' ? 'Bot Active' : 'Bot Off'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
