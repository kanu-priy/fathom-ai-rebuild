'use client';

import React, { useState } from 'react';
import { CheckSquare, Square, Play, Calendar, User, Plus } from 'lucide-react';
import { ActionItem } from '../data/sampleMeetings';
import { sounds } from '../lib/sounds';

interface ActionItemsViewProps {
  actionItems: ActionItem[];
  onToggleComplete: (id: string) => void;
  onSeek: (seconds: number) => void;
  onAddActionItem: (task: string, assignee: string, category: ActionItem['category']) => void;
}

export const ActionItemsView: React.FC<ActionItemsViewProps> = ({ actionItems, onToggleComplete, onSeek, onAddActionItem }) => {
  const [catFilter, setCatFilter] = useState('All');
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [newCat, setNewCat] = useState<ActionItem['category']>('Engineering');

  const fmt = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const cats = ['All', 'Product', 'Engineering', 'Sales', 'Design', 'Compliance'];
  const filtered = actionItems.filter(i => catFilter === 'All' || i.category === catFilter);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    onAddActionItem(newTask, newAssignee || 'Unassigned', newCat);
    sounds.pop();
    setNewTask(''); setNewAssignee(''); setShowAdd(false);
  };

  return (
    <div className="flex flex-col h-full bg-[#0f172a] rounded-2xl border border-gray-800/80 overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-gray-800/60 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <CheckSquare className="w-4 h-4 text-emerald-400" />
          <h3 className="text-sm font-bold text-gray-100">Action Items</h3>
          <span className="text-[11px] text-gray-500">({actionItems.length})</span>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-colors">
          <Plus className="w-3 h-3" /> Add
        </button>
      </div>

      {/* Category Filter */}
      <div className="px-3 py-2 border-b border-gray-800/40 flex gap-1 overflow-x-auto shrink-0">
        {cats.map(c => (
          <button key={c} onClick={() => setCatFilter(c)} className={`shrink-0 px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors ${catFilter === c ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30' : 'text-gray-400 hover:text-gray-200'}`}>{c}</button>
        ))}
      </div>

      {/* Add Form */}
      {showAdd && (
        <form onSubmit={handleAdd} className="p-3 border-b border-gray-800/40 space-y-2 shrink-0 bg-gray-900/30 animate-fade-in">
          <input type="text" required value={newTask} onChange={e => setNewTask(e.target.value)} placeholder="Task description..." className="w-full bg-gray-900 border border-gray-800 text-sm text-gray-200 p-2 rounded-lg focus:outline-none focus:border-blue-500/50" />
          <div className="flex gap-2">
            <input type="text" value={newAssignee} onChange={e => setNewAssignee(e.target.value)} placeholder="Assignee" className="flex-1 bg-gray-900 border border-gray-800 text-sm text-gray-200 p-2 rounded-lg focus:outline-none" />
            <select value={newCat} onChange={e => setNewCat(e.target.value as ActionItem['category'])} className="bg-gray-900 border border-gray-800 text-sm text-gray-200 p-2 rounded-lg focus:outline-none">{['Product','Engineering','Sales','Design','Compliance'].map(c => <option key={c} value={c}>{c}</option>)}</select>
          </div>
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => setShowAdd(false)} className="text-xs text-gray-400 hover:text-white px-3 py-1.5">Cancel</button>
            <button type="submit" className="text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg">Save</button>
          </div>
        </form>
      )}

      {/* Items List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {filtered.length === 0 ? (
          <p className="text-center text-gray-500 text-sm py-12">No items for "{catFilter}".</p>
        ) : filtered.map(item => (
          <div key={item.id} className={`p-3 rounded-xl border flex items-start gap-3 transition-colors ${item.completed ? 'bg-gray-900/20 border-gray-800/40 opacity-60' : 'bg-gray-900/30 border-gray-800/60 hover:bg-gray-800/40'}`}>
            <button onClick={() => { onToggleComplete(item.id); sounds.success(); }} className="mt-0.5 shrink-0">
              {item.completed
                ? <CheckSquare className="w-4.5 h-4.5 text-emerald-400" />
                : <Square className="w-4.5 h-4.5 text-gray-500 hover:text-emerald-400 transition-colors" />}
            </button>
            <div className="flex-1 min-w-0">
              <p className={`text-sm leading-relaxed ${item.completed ? 'line-through text-gray-500' : 'text-gray-200'}`}>{item.task}</p>
              <div className="flex items-center gap-3 mt-1.5 text-[11px] text-gray-500 flex-wrap">
                <span className="flex items-center gap-1">
                  {item.assigneeAvatar ? <img src={item.assigneeAvatar} alt="" className="w-3.5 h-3.5 rounded-full object-cover" /> : <User className="w-3 h-3" />}
                  <span className="font-medium text-gray-400">{item.assigneeName}</span>
                </span>
                <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{item.dueDate}</span>
                <span className="px-1.5 py-0.5 rounded bg-gray-800 text-[10px] text-gray-400 font-semibold">{item.category}</span>
              </div>
            </div>
            <button onClick={() => { onSeek(item.timestamp); sounds.tick(); }} className="shrink-0 flex items-center gap-1 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-lg text-[11px] font-mono font-bold transition-colors" title="Jump to call moment">
              <Play className="w-2.5 h-2.5 fill-current" />{fmt(item.timestamp)}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
