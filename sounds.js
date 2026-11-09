/**
 * RailYatra - Web Audio API Sound Synthesizer
 * Provides authentic procedural railway sound effects without external audio files
 */

class RailwaySoundEngine {
  constructor() {
    this.audioCtx = null;
    this.muted = localStorage.getItem("railyatra_muted") === "true";
    this.ambienceNode = null;
    this.ambienceGain = null;
    this.isAmbiencePlaying = false;
  }

  init() {
    if (!this.audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.audioCtx = new AudioContext();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem("railyatra_muted", this.muted);
    if (this.muted && this.ambienceGain) {
      this.ambienceGain.gain.setValueAtTime(0, this.audioCtx.currentTime);
    } else if (!this.muted && this.ambienceGain && this.isAmbiencePlaying) {
      this.ambienceGain.gain.setValueAtTime(0.04, this.audioCtx.currentTime);
    }
    return this.muted;
  }

  // Realistic Two-Tone Indian Railways Locomotive Horn (Alco / WAP-7 style)
  playHorn() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    // Twin chime: roughly D#4 (311Hz) + F#4 (370Hz)
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(311, now);
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(370, now);

    // Filter to simulate resonant horn trumpet
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gain.gain.setValueAtTime(0.18, now + 0.9);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 1.85);
    osc2.stop(now + 1.85);
  }

  // Station Announcement Chime (Ding-Dong-Ding like railway PA system)
  playAnnouncementChime() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const notes = [587.33, 739.99, 880.0]; // D5, F#5, A5
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + (idx * 0.28);

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.0001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.2, noteTime + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + 0.6);
    });
  }

  // Booking Success Fanfare / Chime
  playSuccessChime() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const now = ctx.currentTime;

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + (idx * 0.12);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.exponentialRampToValueAtTime(0.25, noteTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + (idx === 3 ? 1.0 : 0.4));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(noteTime);
      osc.stop(noteTime + (idx === 3 ? 1.1 : 0.45));
    });
  }

  // Tatkal Countdown Tick
  playTick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // Seat Click or UI Select
  playClick() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.06);
  }

  // RailCoins / Payment Sound
  playCoinDing() {
    if (this.muted) return;
    this.init();
    if (!this.audioCtx) return;

    const ctx = this.audioCtx;
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(987.77, now); // B5
    osc.frequency.setValueAtTime(1318.51, now + 0.08); // E6

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.52);
  }
}

// Global Sound Instance
window.RailwaySound = new RailwaySoundEngine();
