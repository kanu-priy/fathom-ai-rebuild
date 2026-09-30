'use client';

import React from 'react';
import { BarChart3, Clock, Users, Zap } from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';

interface AnalyticsViewProps { meeting: Meeting; }

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ meeting }) => {
  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      <div className="p-3 border-b border-gray-800/60 flex items-center gap-2 shrink-0">
        <BarChart3 className="w-4 h-4 text-blue-400" />
        <h3 className="text-sm font-bold text-gray-100">Talk Time Analytics</h3>
        <span className="text-[11px] text-gray-500 ml-auto">{meeting.speakers.length} Speakers</span>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Clock, label: 'Duration', value: meeting.durationFormatted, color: 'text-blue-400' },
            { icon: Users, label: 'Participants', value: `${meeting.speakers.length}`, color: 'text-emerald-400' },
            { icon: Zap, label: 'Accuracy', value: '99.4%', color: 'text-amber-400' },
          ].map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="p-3 rounded-xl bg-gray-900/50 border border-gray-800/60">
              <div className="flex items-center gap-1.5 text-[11px] text-gray-500 mb-1"><Icon className={`w-3 h-3 ${color}`} />{label}</div>
              <p className="text-lg font-extrabold text-gray-100">{value}</p>
            </div>
          ))}
        </div>

        {/* Speaker Bars */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Talk-Time Share</h4>
          {meeting.speakers.map(spk => (
            <div key={spk.id} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <img src={spk.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                  <span className="font-semibold text-gray-200">{spk.name}</span>
                </div>
                <span className="font-mono text-gray-400">{spk.talkPercentage}%</span>
              </div>
              <div className="w-full bg-gray-900 h-2 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-500" style={{ width: `${spk.talkPercentage}%`, backgroundColor: spk.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
