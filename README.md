# Fathom AI Notetaker Rebuild (Fathom 2.0) — 8x Engineering Assignment

> **Rebuild a live product in 24 hours. Better than the original.**  
> Built for [8x Engineering](https://fathom.video/) hiring process.

---

## 🚀 Overview

Fathom 2.0 is a ground-up rebuild of [Fathom.video](https://fathom.video/), the AI meeting notetaker. Built with Next.js 14, React 18, Tailwind CSS, and Lucide React, it focuses heavily on the core case that actually matters: **high-stakes, multi-speaker meetings (including 8-person hour-long calls)**.

### ✨ Key Features Built & Shipped

1. **8-Person Call Support (The Core Case)**
   - Seeded with a 54-minute, 8-participant cross-functional strategy sync (`Q4 Product Strategy & Cross-Functional Architecture Sync`).
   - Dynamic color-coded speaker timeline, talk-time % progress bars, and multi-avatar video stage layout.

2. **Synchronized Video Player & Interactive Transcript**
   - Video canvas with simulated active-speaker stage and audio waveform visualizer.
   - Real-time scrubbing: clicking any line in the transcript or action item list jumps video playback directly to that exact second.
   - Filter transcript by speaker or highlight category (Key Insight, Action Item, Question, Risk, Bookmark).

3. **Mid-Call Live Highlighting**
   - Signature Fathom feature: one-click live highlight buttons (💡 Key Insight, 🎯 Action Item, ❓ Question, 🚨 Risk).
   - Drops timestamped markers on the video seek bar in real time.

4. **Multi-Template AI Summaries & Custom AI Prompt Generator**
   - Switch templates on the fly: *Executive Summary*, *Sales Discovery (BANT)*, *Engineering Tech Sync*, *Action Items*.
   - Ask AI to generate custom summaries or ask grounded questions with timestamp citations.

5. **Action Items Hub & Clips Library**
   - Checkable task list categorized by Product, Engineering, Sales, Compliance.
   - Timestamp links jump directly to the exact call moment where the task was promised.
   - Create and copy shareable 30s video clip links.

6. **Simulated Live Meeting Recorder ("Stubbed Capture Layer")**
   - Built-in live call simulator allowing users to start a call on Zoom/Meet/Teams, watch real-time transcript streaming and audio waveforms, drop mid-call highlights, and produce an instant AI summary.

7. **Universal Global Search (`⌘K`)**
   - Instant full-text search across all 8-person meeting transcripts, summaries, and action items.

---

## 🛠️ Repository Structure & Agent Logs

- `.agent-logs/` — Contains raw prompt-and-response session logs as required by 8x Agent Capture Setup.
- `CAPTURE-TEST.md` — Agent capture setup verification document.
- `scripts/sync_agent_logs.js` — Transcript sync script.
- `app/` — Next.js 14 App Router application source code.
  - `app/data/sampleMeetings.ts` — Rich multi-speaker sample meeting data.
  - `app/components/` — Modular React UI components (`VideoPlayer`, `TranscriptView`, `AISummaryView`, `ActionItemsView`, `AskAIChat`, `LiveRecorderModal`, `GlobalSearchModal`, `AnalyticsView`, `CalendarView`).

---

## 🏃 Local Setup & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Open [http://localhost:3000](http://localhost:3000) to view the app locally.
