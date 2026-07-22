/**
 * Web Audio Synthesizer & Speech Synthesis Engine (Portuguese)
 */
class AudioEngine {
  constructor() {
    this.audioCtx = null;
    this.synth = window.speechSynthesis;
    this.ptVoice = null;

    this.initVoices();
  }

  getAudioContext() {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  initVoices() {
    if (!this.synth) return;
    
    const loadVoices = () => {
      const voices = this.synth.getVoices();
      // Strictly target European Portuguese (pt-PT) voice
      this.ptVoice = voices.find(v => v.lang === 'pt-PT' || v.lang === 'pt_PT') || 
                     voices.find(v => v.lang.toLowerCase().includes('pt-pt')) || 
                     voices.find(v => v.lang.startsWith('pt')) || 
                     null;
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  // Play procedural success chime (Arpeggio)
  playSuccessSound() {
    try {
      const ctx = this.getAudioContext();
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.1);

        gain.gain.setValueAtTime(0.2, ctx.currentTime + index * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + index * 0.1 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + index * 0.1);
        osc.stop(ctx.currentTime + index * 0.1 + 0.35);
      });
    } catch (e) {
      console.warn("Audio Context Error:", e);
    }
  }

  // Play procedural error buzzer
  playErrorSound() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch (e) {
      console.warn("Audio Context Error:", e);
    }
  }

  // Play click sound on hand drag / button tap
  playClickSound() {
    try {
      const ctx = this.getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  }

  // Speak European Portuguese (pt-PT) time phrase using Web Speech API
  speakTimeInPortuguese(hour, minute, isPm) {
    if (!this.synth) return;

    this.synth.cancel(); // Stop any active speech

    const phrase = this.formatTimePhraseInPtPT(hour, minute, isPm);
    const utterance = new SpeechSynthesisUtterance(phrase);
    utterance.lang = 'pt-PT';

    if (this.ptVoice) {
      utterance.voice = this.ptVoice;
    }
    utterance.rate = 0.88; // Clear cadence for European Portuguese pronunciation

    this.synth.speak(utterance);
  }

  // Authentic European Portuguese (pt-PT) time phrasing logic
  formatTimePhraseInPtPT(hour, minute, isPm) {
    let displayHour = hour;
    if (isPm && hour <= 12) displayHour += 12;
    if (!isPm && hour > 12) displayHour -= 12;

    // Period of the day in European Portuguese (pt-PT)
    let periodStr = "da manhã";
    if (displayHour >= 12 && displayHour < 20) {
      periodStr = "da tarde";
    } else if (displayHour >= 20 || displayHour < 6) {
      periodStr = "da noite";
    }

    if (displayHour === 12 && minute === 0) return "É meio-dia em ponto!";
    if ((displayHour === 24 || displayHour === 0) && minute === 0) return "É meia-noite em ponto!";

    const hour12 = displayHour > 12 ? displayHour - 12 : (displayHour === 0 ? 12 : displayHour);
    const hourWord = hour12 === 1 ? "uma hora" : `${hour12} horas`;

    if (minute === 0) {
      return `São ${hourWord} em ponto ${periodStr}.`;
    } else if (minute === 15) {
      return `São ${hourWord} e um quarto ${periodStr}.`;
    } else if (minute === 30) {
      return `São ${hourWord} e meia ${periodStr}.`;
    } else if (minute === 45) {
      const nextHour12 = (hour12 % 12) + 1;
      const nextHourWord = nextHour12 === 1 ? "uma" : `${nextHour12}`;
      return `Faltam quinze minutos para as ${nextHourWord} ${periodStr}.`;
    } else if (minute < 30) {
      return `São ${hourWord} e ${minute} minutos ${periodStr}.`;
    } else {
      const minToNext = 60 - minute;
      const nextHour12 = (hour12 % 12) + 1;
      const nextHourWord = nextHour12 === 1 ? "uma" : `${nextHour12}`;
      return `Faltam ${minToNext} minutos para as ${nextHourWord} ${periodStr}.`;
    }
  }
}
