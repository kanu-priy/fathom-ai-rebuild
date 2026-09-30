// Web Audio API-based sound effects — no external files needed
// Generates short tones programmatically

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  return audioCtx;
}

export function playTone(freq: number, duration: number, volume: number = 0.15, type: OscillatorType = 'sine') {
  try {
    const ctx = getCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context not available — fail silently
  }
}

// Specific sound presets
export const sounds = {
  // Short click for play/pause
  click: () => playTone(800, 0.08, 0.1, 'square'),

  // Gentle chime for highlights
  highlight: () => {
    playTone(880, 0.15, 0.12, 'sine');
    setTimeout(() => playTone(1100, 0.2, 0.1, 'sine'), 100);
  },

  // Rising tone for starting recording
  recordStart: () => {
    playTone(440, 0.15, 0.12, 'sine');
    setTimeout(() => playTone(660, 0.15, 0.12, 'sine'), 120);
    setTimeout(() => playTone(880, 0.2, 0.1, 'sine'), 240);
  },

  // Descending tone for stopping recording
  recordStop: () => {
    playTone(880, 0.15, 0.12, 'sine');
    setTimeout(() => playTone(660, 0.15, 0.12, 'sine'), 120);
    setTimeout(() => playTone(440, 0.2, 0.1, 'sine'), 240);
  },

  // Soft pop for copy/share actions
  pop: () => playTone(600, 0.06, 0.08, 'triangle'),

  // Subtle tick for seeking
  tick: () => playTone(1200, 0.03, 0.05, 'square'),

  // Success chime for completed actions
  success: () => {
    playTone(523, 0.12, 0.1, 'sine');
    setTimeout(() => playTone(659, 0.12, 0.1, 'sine'), 100);
    setTimeout(() => playTone(784, 0.18, 0.1, 'sine'), 200);
  },

  // Notification bell for new transcript lines
  notify: () => playTone(1047, 0.1, 0.08, 'sine'),
};
