// Web Speech API Voice Engine for Fathom Meeting Playback
// Synthesizes natural spoken dialogue matching speaker personas

let availableVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    availableVoices = window.speechSynthesis.getVoices();
  };
  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

// Speaker persona pitch & voice settings
interface SpeakerVoiceConfig {
  pitch: number;
  rateMultiplier: number;
  preferredGender: 'female' | 'male';
}

const SPEAKER_CONFIGS: Record<string, SpeakerVoiceConfig> = {
  // 8-person call speakers
  'spk-1': { pitch: 1.15, rateMultiplier: 1.0, preferredGender: 'female' }, // Sarah Chen (VP of Product)
  'spk-2': { pitch: 0.9, rateMultiplier: 1.05, preferredGender: 'male' },   // Alex Rivera (Lead Architect)
  'spk-3': { pitch: 0.85, rateMultiplier: 1.0, preferredGender: 'male' },   // Marcus Brody (Director of Sales)
  'spk-4': { pitch: 1.25, rateMultiplier: 1.0, preferredGender: 'female' }, // Priya Patel (Head of Design)
  'spk-5': { pitch: 0.95, rateMultiplier: 1.0, preferredGender: 'male' },   // David Kim (Sr Backend)
  'spk-6': { pitch: 1.1, rateMultiplier: 1.0, preferredGender: 'female' },  // Elena Rostova (Customer Success)
  'spk-7': { pitch: 1.0, rateMultiplier: 1.1, preferredGender: 'male' },    // James Wright (Growth Marketing)
  'spk-8': { pitch: 0.88, rateMultiplier: 0.95, preferredGender: 'male' },  // Jordan Lee (Security & Compliance)

  // Acme Sales Call speakers
  'spk-m1': { pitch: 0.85, rateMultiplier: 1.0, preferredGender: 'male' },  // Marcus Brody
  'spk-m2': { pitch: 1.2, rateMultiplier: 1.0, preferredGender: 'female' }, // Rachel Adams (CTO Acme)
  'spk-m3': { pitch: 0.9, rateMultiplier: 0.95, preferredGender: 'male' },  // John Miller (InfoSec)

  // AI Pipeline Sync
  'spk-a1': { pitch: 0.9, rateMultiplier: 1.05, preferredGender: 'male' },
  'spk-a2': { pitch: 0.95, rateMultiplier: 1.0, preferredGender: 'male' },
  'spk-a3': { pitch: 1.1, rateMultiplier: 1.0, preferredGender: 'male' },
};

export function stopSpeaking() {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (e) {
      // Ignore
    }
  }
}

export function speakTranscriptLine(
  text: string,
  speakerId: string,
  speed: number = 1,
  onEnd?: () => void
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const config = SPEAKER_CONFIGS[speakerId] || { pitch: 1.0, rateMultiplier: 1.0, preferredGender: 'female' };
    const utterance = new SpeechSynthesisUtterance(text);

    // Pick best matching voice
    if (availableVoices.length === 0) {
      availableVoices = window.speechSynthesis.getVoices();
    }

    const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'));
    const candidateVoices = englishVoices.length > 0 ? englishVoices : availableVoices;

    if (candidateVoices.length > 0) {
      // Try to find female/male voice matching config
      let chosen = candidateVoices[0];
      for (const v of candidateVoices) {
        const name = v.name.toLowerCase();
        if (config.preferredGender === 'female' && (name.includes('female') || name.includes('zira') || name.includes('samantha') || name.includes('victoria') || name.includes('jenny') || name.includes('aria'))) {
          chosen = v;
          break;
        } else if (config.preferredGender === 'male' && (name.includes('male') || name.includes('david') || name.includes('george') || name.includes('mark') || name.includes('guy'))) {
          chosen = v;
          break;
        }
      }
      utterance.voice = chosen;
    }

    utterance.pitch = config.pitch;
    utterance.rate = Math.max(0.75, Math.min(2.0, speed * config.rateMultiplier));
    utterance.volume = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.error('Speech synthesis error:', err);
  }
}
