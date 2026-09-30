'use client';

import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VideoPlayer } from './components/VideoPlayer';
import { TranscriptView } from './components/TranscriptView';
import { AISummaryView } from './components/AISummaryView';
import { ActionItemsView } from './components/ActionItemsView';
import { AskAIChat } from './components/AskAIChat';
import { CalendarView } from './components/CalendarView';
import { ClipsModal } from './components/ClipsModal';
import { AnalyticsView } from './components/AnalyticsView';
import { LiveRecorderModal } from './components/LiveRecorderModal';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { SAMPLE_MEETINGS, Meeting, ActionItem, Clip } from './data/sampleMeetings';
import { FileText, Mic, CheckSquare, MessageSquare, Share2, Download, Clock, Users } from 'lucide-react';

type DetailTab = 'summary' | 'transcript' | 'action_items' | 'ask_ai';

export default function Home() {
  const [meetings, setMeetings] = useState<Meeting[]>(SAMPLE_MEETINGS);
  const [selectedId, setSelectedId] = useState(SAMPLE_MEETINGS[0].id);
  const [sidebarTab, setSidebarTab] = useState('recordings');
  const [detailTab, setDetailTab] = useState<DetailTab>('summary');
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const meeting = meetings.find(m => m.id === selectedId) || meetings[0];
  const allActions = meetings.reduce((n, m) => n + m.actionItems.length, 0);
  const allClips = meetings.reduce((n, m) => n + m.clips.length, 0);

  const seek = (s: number) => setCurrentTime(s);

  const addHighlight = (type: 'insight' | 'action' | 'question' | 'risk' | 'bookmark', note?: string) => {
    setMeetings(prev => prev.map(m => m.id !== selectedId ? m : {
      ...m,
      transcript: [...m.transcript, {
        id: `h-${Date.now()}`, speakerId: m.speakers[0]?.id || '', speakerName: m.speakers[0]?.name || '',
        speakerRole: m.speakers[0]?.role || '', speakerAvatar: m.speakers[0]?.avatar || '',
        speakerColor: m.speakers[0]?.color || '#3b82f6',
        startTime: currentTime, endTime: currentTime + 5,
        text: `Highlight at ${Math.floor(currentTime / 60)}m ${Math.floor(currentTime % 60)}s`,
        highlightType: type, highlightNote: note,
      }],
    }));
  };

  const shareClip = (start: number, end: number) => {
    const clip: Clip = {
      id: `c-${Date.now()}`, title: `Clip from ${meeting.title}`,
      startTime: start, endTime: end,
      creatorName: meeting.speakers[0]?.name || 'You',
      creatorAvatar: meeting.speakers[0]?.avatar || '',
      sharedUrl: `https://fathom.video/clip/${meeting.id}-${Math.floor(start)}`,
      tags: ['Highlight'],
    };
    setMeetings(prev => prev.map(m => m.id !== selectedId ? m : { ...m, clips: [clip, ...m.clips] }));
    setSidebarTab('clips');
  };

  const toggleAction = (id: string) => {
    setMeetings(prev => prev.map(m => ({
      ...m,
      actionItems: m.actionItems.map(a => a.id === id ? { ...a, completed: !a.completed } : a),
    })));
  };

  const addAction = (task: string, assignee: string, cat: ActionItem['category']) => {
    setMeetings(prev => prev.map(m => m.id !== selectedId ? m : {
      ...m,
      actionItems: [{
        id: `a-${Date.now()}`, task, assigneeName: assignee,
        assigneeAvatar: '', dueDate: 'TBD', completed: false,
        timestamp: currentTime, category: cat,
      }, ...m.actionItems],
    }));
  };

  const saveNewMeeting = (m: Meeting) => {
    setMeetings(prev => [m, ...prev]);
    setSelectedId(m.id);
    setSidebarTab('recordings');
  };

  const searchSelect = (mid: string, ts?: number) => {
    setSelectedId(mid);
    setSidebarTab('recordings');
    if (ts !== undefined) { setCurrentTime(ts); setDetailTab('transcript'); }
  };

  const DETAIL_TABS: { id: DetailTab; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'summary', label: 'AI Summary', icon: FileText },
    { id: 'transcript', label: 'Transcript', icon: Mic },
    { id: 'action_items', label: 'Actions', icon: CheckSquare, badge: meeting.actionItems.length },
    { id: 'ask_ai', label: 'Ask AI', icon: MessageSquare },
  ];

  // Determine what to render in the main content area
  const renderMainContent = () => {
    if (sidebarTab === 'calendar') return <div className="h-full"><CalendarView onOpenLiveRecorder={() => setShowRecorder(true)} /></div>;
    if (sidebarTab === 'action_items') return <div className="h-full"><ActionItemsView actionItems={meetings.flatMap(m => m.actionItems)} onToggleComplete={toggleAction} onSeek={seek} onAddActionItem={addAction} /></div>;
    if (sidebarTab === 'clips') return <div className="h-full"><ClipsModal clips={meetings.flatMap(m => m.clips)} onSeek={seek} /></div>;
    if (sidebarTab === 'analytics') return <div className="h-full"><AnalyticsView meeting={meeting} /></div>;

    // recordings tab — the main dual-panel view
    return (
      <div className="flex flex-col h-full gap-4">
        {/* Meeting Header */}
        <div className="bg-[#0f172a] rounded-xl p-4 border border-gray-800/60 flex items-center justify-between gap-4 shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-lg font-bold text-white truncate">{meeting.title}</h1>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold shrink-0">{meeting.platform}</span>
              {meeting.speakers.length >= 8 && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 font-bold shrink-0">🔥 8-Person Call</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[11px] text-gray-500">
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{meeting.durationFormatted}</span>
              <span className="flex items-center gap-1"><Users className="w-3 h-3" />{meeting.speakers.length} speakers</span>
              <span>Host: {meeting.organizer}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button onClick={() => shareClip(0, 30)} className="flex items-center gap-1 bg-purple-600/15 text-purple-300 border border-purple-500/30 px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:bg-purple-600/25 transition-colors">
              <Share2 className="w-3 h-3" /> Share
            </button>
            <button
              onClick={() => {
                const blob = new Blob([JSON.stringify(meeting, null, 2)], { type: 'application/json' });
                const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
                a.download = `${meeting.id}-notes.json`; a.click();
              }}
              className="flex items-center gap-1 bg-gray-900 border border-gray-800 text-gray-300 px-3 py-1.5 rounded-lg text-[11px] font-semibold hover:text-white transition-colors"
            >
              <Download className="w-3 h-3" /> Export
            </button>
          </div>
        </div>

        {/* Dual Panel: Video (left) + Detail Tabs (right) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
          {/* Left — Video Player */}
          <div className="lg:col-span-5 overflow-y-auto">
            <VideoPlayer
              meeting={meeting}
              currentTime={currentTime}
              onSeek={seek}
              isPlaying={isPlaying}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
              onAddHighlight={addHighlight}
              onShareClip={shareClip}
            />
          </div>

          {/* Right — Detail Tabs */}
          <div className="lg:col-span-7 flex flex-col min-h-0">
            {/* Tab Bar */}
            <div className="flex items-center gap-1 p-1 bg-gray-900/50 rounded-xl border border-gray-800/60 mb-3 shrink-0">
              {DETAIL_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setDetailTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                    detailTab === tab.id
                      ? tab.id === 'ask_ai' ? 'bg-purple-600 text-white' : 'bg-blue-600 text-white'
                      : 'text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  {tab.badge !== undefined && (
                    <span className="w-4 h-4 rounded-full bg-white/10 text-[9px] flex items-center justify-center font-bold">{tab.badge}</span>
                  )}
                </button>
              ))}
            </div>

            {/* Tab Content — fills remaining space */}
            <div className="flex-1 min-h-0">
              {detailTab === 'summary' && <AISummaryView meeting={meeting} onSeek={seek} />}
              {detailTab === 'transcript' && <TranscriptView meeting={meeting} currentTime={currentTime} onSeek={seek} onShareClip={shareClip} />}
              {detailTab === 'action_items' && <ActionItemsView actionItems={meeting.actionItems} onToggleComplete={toggleAction} onSeek={seek} onAddActionItem={addAction} />}
              {detailTab === 'ask_ai' && <AskAIChat meeting={meeting} onSeek={seek} />}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0b0f19]">
      <Navbar onOpenSearch={() => setShowSearch(true)} onOpenLiveRecorder={() => setShowRecorder(true)} />

      <div className="flex-1 flex min-h-0 overflow-hidden">
        <Sidebar
          activeTab={sidebarTab}
          setActiveTab={setSidebarTab}
          meetings={meetings}
          selectedMeetingId={selectedId}
          onSelectMeeting={setSelectedId}
          actionItemsCount={allActions}
          clipsCount={allClips}
        />

        {/* Main Content */}
        <main className="flex-1 overflow-hidden p-4">
          {renderMainContent()}
        </main>
      </div>

      <LiveRecorderModal isOpen={showRecorder} onClose={() => setShowRecorder(false)} onSaveNewMeeting={saveNewMeeting} />
      <GlobalSearchModal isOpen={showSearch} onClose={() => setShowSearch(false)} meetings={meetings} onSelectSearchResult={searchSelect} />
    </div>
  );
}
