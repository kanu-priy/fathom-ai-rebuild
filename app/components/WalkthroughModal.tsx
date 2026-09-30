'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Video, Volume2, Sparkles, CheckCircle2, ArrowRight, Download, Share2, CircleDot, X } from 'lucide-react';
import { speakText, cancelSpeech } from '../lib/speech';
import { playChimeSound, playClickSound } from '../lib/sounds';

interface WalkthroughModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTab?: (tab: string) => void;
}

const DEMO_STEPS = [
  {
    id: 1,
    title: "1. 8-Person Multi-Speaker Call",
    description: "Fathom AI automatically tracks up to 8 simultaneous speakers with live avatars and color-coded active speaker indicators.",
    narration: "Welcome to Fathom AI, the intelligent meeting notetaker. Here we have an 8-person cross-functional strategy call with real-time speaker avatars and active speaker detection.",
    targetTab: "recordings",
  },
  {
    id: 2,
    title: "2. Synchronized Transcript & Audio",
    description: "Every spoken word is transcribed in real-time. Click any line to seek playback instantly.",
    narration: "Our synchronized transcript highlights dialogue line by line. Clicking any transcript line seeks video playback instantly to that exact timestamp.",
    targetTab: "recordings",
  },
  {
    id: 3,
    title: "3. Dynamic AI Summary Templates",
    description: "Switch seamlessly between Executive, Sales, and Engineering summary templates.",
    narration: "Instantly switch AI summary templates between Executive Summaries, Sales Briefs, and Engineering Tech Syncs to tailor notes for different stakeholders.",
    targetTab: "summary",
  },
  {
    id: 4,
    title: "4. Automated Action Items",
    description: "Extract deliverables automatically with assignee tagging and due dates.",
    narration: "Action items are automatically extracted from the conversation with assigned team members and completion checkboxes.",
    targetTab: "actions",
  },
  {
    id: 5,
    title: "5. Ask AI with Video Citations",
    description: "Query call context with AI assistant for instant answers and timestamped video jumps.",
    narration: "Our Ask AI assistant answers questions directly from the call transcript and provides clickable video timestamp citations.",
    targetTab: "chat",
  },
  {
    id: 6,
    title: "6. Simulated Live Meeting Bot",
    description: "Bot joins meetings automatically, streams transcription, and tags key moments mid-call.",
    narration: "Our live meeting recorder bot joins calls automatically, streams live transcription, and allows 1-click highlight tagging mid-call.",
    targetTab: "recordings",
  }
];

export const WalkthroughModal: React.FC<WalkthroughModalProps> = ({ isOpen, onClose }) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecordingScreen, setIsRecordingScreen] = useState(false);
  const [recordedVideoUrl, setRecordedVideoUrl] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const currentStep = DEMO_STEPS[currentStepIndex];

  useEffect(() => {
    if (!isOpen) {
      cancelSpeech();
      setIsPlaying(false);
    }
  }, [isOpen]);

  const handleStartWalkthrough = () => {
    setIsPlaying(true);
    setCurrentStepIndex(0);
    playStep(0);
  };

  const playStep = (index: number) => {
    if (index >= DEMO_STEPS.length) {
      setIsPlaying(false);
      speakText("That concludes the Fathom AI product walkthrough. Thank you for watching!");
      return;
    }
    const step = DEMO_STEPS[index];
    playChimeSound();
    speakText(step.narration, 'Sarah Chen', () => {
      // Step finished speaking
      if (index < DEMO_STEPS.length - 1) {
        setTimeout(() => {
          setCurrentStepIndex(index + 1);
          playStep(index + 1);
        }, 1200);
      } else {
        setIsPlaying(false);
      }
    });
  };

  const handleTogglePlay = () => {
    if (isPlaying) {
      cancelSpeech();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      playStep(currentStepIndex);
    }
  };

  const handleNextStep = () => {
    cancelSpeech();
    const nextIdx = Math.min(DEMO_STEPS.length - 1, currentStepIndex + 1);
    setCurrentStepIndex(nextIdx);
    if (isPlaying) {
      playStep(nextIdx);
    } else {
      speakText(DEMO_STEPS[nextIdx].narration, 'Sarah Chen');
    }
  };

  const handlePrevStep = () => {
    cancelSpeech();
    const prevIdx = Math.max(0, currentStepIndex - 1);
    setCurrentStepIndex(prevIdx);
    if (isPlaying) {
      playStep(prevIdx);
    } else {
      speakText(DEMO_STEPS[prevIdx].narration, 'Sarah Chen');
    }
  };

  // Screen recording function
  const handleStartScreenRecording = async () => {
    try {
      playClickSound();
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser' },
        audio: true
      });

      recordedChunksRef.current = [];
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        setRecordedVideoUrl(url);
        setIsRecordingScreen(false);
      };

      mediaRecorder.start();
      setIsRecordingScreen(true);
      handleStartWalkthrough();

      stream.getVideoTracks()[0].onended = () => {
        if (mediaRecorder.state !== 'inactive') {
          mediaRecorder.stop();
        }
      };
    } catch (err) {
      console.error("Screen recording failed:", err);
      alert("Screen recording permission was denied or not supported in this browser environment.");
    }
  };

  const handleStopScreenRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0f172a] border border-blue-500/30 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-gray-800 bg-gradient-to-r from-blue-950/60 to-purple-950/60 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                AI Voice Walkthrough Generator
                <span className="text-[10px] bg-purple-500/20 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded-full font-semibold">
                  Assignment Demo
                </span>
              </h2>
              <p className="text-xs text-gray-400">Automated product tour with synthesized AI narration</p>
            </div>
          </div>
          <button
            onClick={() => {
              cancelSpeech();
              onClose();
            }}
            className="p-1.5 text-gray-400 hover:text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto flex-1">
          {/* Active Step Display */}
          <div className="bg-gray-900/80 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">
                Step {currentStepIndex + 1} of {DEMO_STEPS.length}
              </span>
              <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>AI Voice Synthesis Active</span>
              </div>
            </div>

            <h3 className="text-lg font-bold text-white">{currentStep.title}</h3>
            <p className="text-sm text-gray-300 leading-relaxed">{currentStep.description}</p>

            <div className="bg-blue-950/40 border border-blue-500/30 p-3 rounded-lg flex items-start gap-2.5 text-xs text-blue-200">
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-blue-300 mb-0.5">AI Voice Script Line:</p>
                <p className="italic text-gray-300">&quot;{currentStep.narration}&quot;</p>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-[11px] text-gray-400 font-medium">
              <span>Demo Progress</span>
              <span>{Math.round(((currentStepIndex + 1) / DEMO_STEPS.length) * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-500 rounded-full"
                style={{ width: `${((currentStepIndex + 1) / DEMO_STEPS.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Screen Recording Section */}
          {recordedVideoUrl ? (
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30 space-y-3">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Walkthrough Video Recorded Successfully!</span>
              </div>
              <video src={recordedVideoUrl} controls className="w-full rounded-lg border border-gray-800 max-h-48 bg-black" />
              <div className="flex items-center gap-2">
                <a
                  href={recordedVideoUrl}
                  download="Fathom_AI_Walkthrough_Demo.webm"
                  className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" /> Download Video File (.webm)
                </a>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isRecordingScreen ? 'bg-red-500/20 text-red-400 animate-ping' : 'bg-gray-800 text-gray-400'}`}>
                  <CircleDot className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-gray-200">
                    {isRecordingScreen ? "Screen Recording in Progress..." : "Record Video File directly in Browser"}
                  </p>
                  <p className="text-[11px] text-gray-400">Captures video + AI voice audio for instant upload</p>
                </div>
              </div>
              {isRecordingScreen ? (
                <button
                  onClick={handleStopScreenRecording}
                  className="bg-red-600 hover:bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors"
                >
                  Stop Recording
                </button>
              ) : (
                <button
                  onClick={handleStartScreenRecording}
                  className="bg-purple-600 hover:bg-purple-500 text-white font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-lg shadow-purple-600/20"
                >
                  <Video className="w-3.5 h-3.5" /> Record Screen
                </button>
              )}
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-gray-800 bg-gray-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevStep}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition-colors"
            >
              Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStepIndex === DEMO_STEPS.length - 1}
              className="px-3 py-1.5 rounded-lg bg-gray-900 border border-gray-800 text-xs font-semibold text-gray-300 disabled:opacity-40 hover:bg-gray-800 transition-colors"
            >
              Next
            </button>
          </div>

          <button
            onClick={handleStartWalkthrough}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" /> Pause AI Tour
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" /> Start AI Voice Tour
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
