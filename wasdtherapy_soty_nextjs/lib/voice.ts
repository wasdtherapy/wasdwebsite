// Web Speech API voice guide. Fully guarded, no-op when unsupported.
let warmed = false;

function pickVoice(lang: string): SpeechSynthesisVoice | null {
  try {
    const voices = window.speechSynthesis.getVoices();
    if (!voices || !voices.length) return null;
    const want = lang === "ru" ? "ru" : "en";
    const exact = voices.find((v) => v.lang?.toLowerCase().startsWith(want));
    return exact ?? voices[0] ?? null;
  } catch {
    return null;
  }
}

export function warmVoices() {
  try {
    if (warmed || typeof window === "undefined") return;
    window.speechSynthesis?.getVoices();
    warmed = true;
  } catch {
    /* ignore */
  }
}

export function speak(text: string, lang: "ru" | "en" = "ru", rate = 0.82) {
  try {
    if (typeof window === "undefined") return;
    const synth = window.speechSynthesis;
    if (!synth) return;
    const u = new SpeechSynthesisUtterance(text);
    const v = pickVoice(lang);
    if (v) u.voice = v;
    u.lang = lang === "ru" ? "ru-RU" : "en-US";
    u.rate = rate;
    u.pitch = 0.95;
    u.volume = 0.9;
    synth.speak(u);
  } catch {
    /* ignore */
  }
}

export function cancelSpeech() {
  try {
    window.speechSynthesis?.cancel();
  } catch {
    /* ignore */
  }
}

export function voiceSupported() {
  try {
    return typeof window !== "undefined" && "speechSynthesis" in window;
  } catch {
    return false;
  }
}
