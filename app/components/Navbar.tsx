'use client';

import React from 'react';
import { Search, Video, Calendar, Sparkles } from 'lucide-react';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenLiveRecorder: () => void;
  onOpenWalkthrough?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenLiveRecorder, onOpenWalkthrough }) => {
  return (
    <header className="h-14 shrink-0 border-b border-gray-800/80 bg-[#0f172a] px-5 flex items-center justify-between z-30">
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center shadow-md shadow-blue-500/20">
          <img src="/favicon.svg" alt="Fathom AI" className="w-full h-full object-cover" />
        </div>
        <span className="font-bold text-lg tracking-tight text-white">
          fathom<span className="text-blue-400">.ai</span>
        </span>
        <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 font-semibold ml-1">
          Pro
        </span>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* AI Voice Walkthrough Tour */}
        {onOpenWalkthrough && (
          <button
            onClick={onOpenWalkthrough}
            className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all shadow-md shadow-purple-600/20"
          >
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>AI Demo Tour</span>
          </button>
        )}

        {/* Search */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 border border-gray-800 text-gray-400 hover:text-gray-200 px-3.5 py-1.5 rounded-lg text-sm transition-colors"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search meetings...</span>
          <kbd className="hidden md:inline text-[10px] px-1.5 py-0.5 bg-gray-800 rounded border border-gray-700 text-gray-500 ml-2">⌘K</kbd>
        </button>

        {/* Simulate Call */}
        <button
          onClick={onOpenLiveRecorder}
          className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-1.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <Video className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Recording</span>
        </button>

        {/* Calendar Badge */}
        <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
          <Calendar className="w-3 h-3" />
          <span>Calendar Synced</span>
        </div>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-800">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"
            alt="User"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};
