'use client';

import React from 'react';
import { Mic, Calendar, CheckSquare, Scissors, BarChart3, Clock, Users } from 'lucide-react';
import { Meeting } from '../data/sampleMeetings';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  meetings: Meeting[];
  selectedMeetingId: string;
  onSelectMeeting: (id: string) => void;
  actionItemsCount: number;
  clipsCount: number;
}

const NAV_ITEMS = [
  { id: 'recordings', label: 'Recordings', icon: Mic },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
  { id: 'action_items', label: 'Action Items', icon: CheckSquare },
  { id: 'clips', label: 'Clips', icon: Scissors },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  meetings,
  selectedMeetingId,
  onSelectMeeting,
  actionItemsCount,
  clipsCount,
}) => {
  const badgeCounts: Record<string, number | null> = {
    recordings: meetings.length,
    action_items: actionItemsCount,
    clips: clipsCount,
    calendar: null,
    analytics: null,
  };

  return (
    <aside className="w-72 shrink-0 border-r border-gray-800/80 bg-[#0f172a]/90 flex flex-col overflow-hidden">
      {/* Nav Tabs */}
      <nav className="p-3 space-y-0.5 border-b border-gray-800/60">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          const count = badgeCounts[id];
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Icon className="w-4 h-4" />
                <span>{label}</span>
              </span>
              {count !== null && (
                <span className="text-[11px] px-1.5 py-0.5 rounded-md bg-gray-800/80 text-gray-300 font-semibold min-w-[20px] text-center">
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Meetings List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500 px-1 mb-1">
          Recent Meetings
        </p>
        {meetings.map((mtg) => {
          const isSelected = mtg.id === selectedMeetingId;
          return (
            <button
              key={mtg.id}
              onClick={() => {
                onSelectMeeting(mtg.id);
                setActiveTab('recordings');
              }}
              className={`w-full text-left p-3 rounded-xl border transition-colors ${
                isSelected
                  ? 'bg-blue-950/40 border-blue-500/40'
                  : 'bg-gray-900/30 border-gray-800/60 hover:bg-gray-800/40 hover:border-gray-700'
              }`}
            >
              <p className="text-sm font-semibold text-gray-100 truncate mb-1.5">{mtg.title}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {mtg.durationFormatted}
                </span>
                <span className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  {mtg.speakers.length}
                </span>
                <span>{new Date(mtg.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
              {/* Speaker Avatars */}
              <div className="flex -space-x-1.5 mt-2">
                {mtg.speakers.slice(0, 5).map((spk) => (
                  <img
                    key={spk.id}
                    src={spk.avatar}
                    alt={spk.name}
                    title={spk.name}
                    className="w-5 h-5 rounded-full ring-1 ring-gray-900 object-cover"
                  />
                ))}
                {mtg.speakers.length > 5 && (
                  <span className="w-5 h-5 rounded-full bg-gray-800 text-[9px] font-bold text-gray-300 flex items-center justify-center ring-1 ring-gray-900">
                    +{mtg.speakers.length - 5}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-800/60 shrink-0">
        <div className="flex items-center justify-between text-[11px] text-gray-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            Bot Connected
          </span>
          <span className="font-mono">v2.4</span>
        </div>
      </div>
    </aside>
  );
};
