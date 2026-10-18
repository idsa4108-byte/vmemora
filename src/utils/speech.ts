// High-Fidelity American English Pronunciation System for Vmemora

let activeAudio: HTMLAudioElement | null = null;
let cachedVoices: SpeechSynthesisVoice[] = [];

// Pre-warm browser speech synthesis voices if available
if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  const loadVoices = () => {
    try {
      const v = window.speechSynthesis.getVoices();
      if (v && v.length > 0) {
        cachedVoices = v;
      }
    } catch {
      // Ignore
    }
  };

  loadVoices();
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = loadVoices;
  }
}

/**
 * Checks whether a voice is strictly an English voice and not French/other.
 */
function isEnglishVoice(voice: SpeechSynthesisVoice): boolean {
  if (!voice) return false;
  const lang = (voice.lang || '').replace('_', '-').toLowerCase();
  const name = (voice.name || '').toLowerCase();

  // Strict anti-French filter: Reject any voice associated with French or other non-English languages
  if (
    lang.startsWith('fr') ||
    name.includes('french') ||
    name.includes('français') ||
    name.includes('francais')
  ) {
    return false;
  }

  // Must be English
  return (
    lang.startsWith('en') ||
    name.includes('english') ||
    name.includes('united states') ||
    name.includes('american')
  );
}

/**
 * Finds the highest quality American English voice available in the client browser.
 */
function findBestAmericanVoice(): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;

  const voices =
    cachedVoices.length > 0
      ? cachedVoices
      : window.speechSynthesis.getVoices();

  if (!voices || voices.length === 0) return null;

  // 1. Top priority: High quality US English voices (en-US / en_US)
  const usVoice = voices.find(
    (v) =>
      isEnglishVoice(v) &&
      (v.lang.replace('_', '-').toLowerCase() === 'en-us' ||
        v.lang.replace('_', '-').toLowerCase().startsWith('en-us')) &&
      (v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Ava') ||
        v.name.includes('Alex') ||
        v.name.includes('Jenny') ||
        v.name.includes('David') ||
        v.name.includes('Aria') ||
        v.name.includes('Guy') ||
        v.name.includes('Zira'))
  );
  if (usVoice) return usVoice;

  // 2. Any en-US voice
  const anyUsVoice = voices.find(
    (v) =>
      isEnglishVoice(v) &&
      (v.lang.replace('_', '-').toLowerCase() === 'en-us' ||
        v.lang.replace('_', '-').toLowerCase().startsWith('en-us'))
  );
  if (anyUsVoice) return anyUsVoice;

  // 3. Any English voice with US in the name
  const nameUsVoice = voices.find(
    (v) =>
      isEnglishVoice(v) &&
      (v.name.toLowerCase().includes('united states') ||
        v.name.toLowerCase().includes('us english') ||
        v.name.toLowerCase().includes('american'))
  );
  if (nameUsVoice) return nameUsVoice;

  // 4. Any English voice (e.g. en-GB, en-AU, en-CA)
  const anyEnglishVoice = voices.find((v) => isEnglishVoice(v));
  if (anyEnglishVoice) return anyEnglishVoice;

  return null;
}

/**
 * Synthesizes speech using the browser's SpeechSynthesis engine with strict English voice guard.
 */
function speakViaSpeechSynthesis(
  cleanText: string,
  onFallback?: (url: string) => void,
  translateUrl?: string
) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    if (onFallback && translateUrl) onFallback(translateUrl);
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = 'en-US';
    utterance.rate = 0.95;
    utterance.pitch = 1.0;

    const bestVoice = findBestAmericanVoice();

    // CRITICAL: Only set voice if an authentic English voice was identified.
    // If no English voice exists and default voice is French, DO NOT speak with default voice!
    if (bestVoice) {
      utterance.voice = bestVoice;
      utterance.lang = bestVoice.lang || 'en-US';
      window.speechSynthesis.speak(utterance);
    } else {
      // Re-query voices once in case they just became ready
      const freshVoices = window.speechSynthesis.getVoices();
      cachedVoices = freshVoices;
      const delayedVoice = findBestAmericanVoice();
      if (delayedVoice) {
        utterance.voice = delayedVoice;
        utterance.lang = delayedVoice.lang || 'en-US';
        window.speechSynthesis.speak(utterance);
      } else if (onFallback && translateUrl) {
        // Prevent French voice from speaking English
        onFallback(translateUrl);
      }
    }
  } catch (err) {
    console.warn('SpeechSynthesis error:', err);
    if (onFallback && translateUrl) onFallback(translateUrl);
  }
}

/**
 * Primary pronunciation player for Vmemora.
 * Uses native American English audio stream (/api/tts) first to guarantee 100% authentic US pronunciation,
 * with intelligent client-side SpeechSynthesis fallback.
 */
export function speakWord(
  text: string,
  _langName?: string,
  onFallback?: (translateUrl: string) => void
): void {
  if (!text || typeof window === 'undefined') return;

  const cleanText = text.trim();
  if (!cleanText) return;

  const translateUrl = `https://translate.google.com/?sl=en&tl=en&text=${encodeURIComponent(
    cleanText
  )}&op=translate`;

  // Stop any currently playing audio
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch {
      // Ignore
    }
    activeAudio = null;
  }

  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch {
      // Ignore
    }
  }

  // Strategy 1: High-fidelity American English audio stream from server proxy
  try {
    const audioUrl = `/api/tts?text=${encodeURIComponent(cleanText)}`;
    const audio = new Audio(audioUrl);
    activeAudio = audio;

    let hasHandledFallback = false;
    const triggerFallback = () => {
      if (hasHandledFallback) return;
      hasHandledFallback = true;
      speakViaSpeechSynthesis(cleanText, onFallback, translateUrl);
    };

    audio.oncanplaythrough = () => {
      // Audio is ready to play
    };

    audio.onerror = () => {
      triggerFallback();
    };

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((playErr) => {
        console.warn('Audio play error, falling back to Web Speech:', playErr);
        triggerFallback();
      });
    }
  } catch (e) {
    console.warn('Failed to initialize Audio element, falling back:', e);
    speakViaSpeechSynthesis(cleanText, onFallback, translateUrl);
  }
}

/**
 * Utility to test the American English pronunciation system.
 */
export function testAmericanVoice(onFallback?: (url: string) => void): void {
  speakWord('Welcome to Vmemora. Mastering English vocabulary with American pronunciation.', 'English', onFallback);
}
