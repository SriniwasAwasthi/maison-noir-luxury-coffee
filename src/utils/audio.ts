// Continuous Web Audio Ambient Jazz & Vinyl Soundscape Generator for Maison Noir
// Infinite loop that plays automatically and continuously until user leaves or mutes.

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let masterGain: GainNode | null = null;
let noiseNode: AudioBufferSourceNode | null = null;
let musicInterval: any = null;
let melodyInterval: any = null;
let activeOscillators: OscillatorNode[] = [];

export function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export function startAmbientSound(mode: 'vinyl' | 'espresso' | 'rain' = 'vinyl', volume: number = 0.28): boolean {
  try {
    const ctx = getAudioContext();
    stopAmbientSound();

    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // 1. Endless Vinyl Texture & Warm Crackle
    const bufferSize = ctx.sampleRate * 3;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      // Warm vinyl groove hiss + periodic microscopic pops
      const isCrackle = Math.random() < 0.002;
      const crackleGain = isCrackle ? (Math.random() * 0.9 - 0.45) : 0;
      output[i] = (Math.random() * 2 - 1) * 0.045 + crackleGain;
    }

    noiseNode = ctx.createBufferSource();
    noiseNode.buffer = noiseBuffer;
    noiseNode.loop = true;

    // Filter to warm acoustic low-pass
    const filter = ctx.createBiquadFilter();
    filter.type = mode === 'rain' ? 'bandpass' : 'lowpass';
    filter.frequency.setValueAtTime(mode === 'espresso' ? 1400 : 720, ctx.currentTime);
    filter.Q.setValueAtTime(mode === 'rain' ? 2 : 1, ctx.currentTime);

    noiseNode.connect(filter);
    filter.connect(masterGain);
    noiseNode.start();

    // 2. Continuous Romantic Jazz Lounge Harmony (Endless Cyclic Cadence)
    // Rich extended 7th & 9th jazz voicings:
    const jazzChords = [
      [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9 (warm velvet)
      [110.00, 164.81, 220.00, 261.63, 329.63], // Am9
      [146.83, 220.00, 261.63, 311.13, 369.99], // Dm9 (amber glow)
      [98.00, 146.83, 220.00, 246.94, 329.63],  // G13
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7#11
      [164.81, 196.00, 246.94, 293.66, 349.23], // Em7
      [110.00, 146.83, 174.61, 220.00, 293.66], // A7alt
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (!ctx || !masterGain) return;

      // Gracefully fade out old oscillators
      activeOscillators.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      activeOscillators = [];

      const freqs = jazzChords[chordIdx % jazzChords.length];
      chordIdx++;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();

        // Warm blend of sine and triangle harmonics for acoustic piano feel
        osc.type = idx === 0 ? 'sine' : idx % 2 === 0 ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Soft swelling attack and long luxurious decay
        oscGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        oscGain.gain.exponentialRampToValueAtTime(0.025 / Math.sqrt(idx + 1), ctx.currentTime + 2.2);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 8.8);

        osc.connect(oscGain);
        oscGain.connect(masterGain!);
        osc.start();
        osc.stop(ctx.currentTime + 9);
        activeOscillators.push(osc);
      });
    };

    // 3. Ambient Vibraphone / Siphon Melodic Accents
    const playSubtleNotes = () => {
      if (!ctx || !masterGain || Math.random() > 0.7) return;
      const melodyPitches = [523.25, 587.33, 659.25, 783.99, 880.00, 987.77, 1046.50];
      const noteFreq = melodyPitches[Math.floor(Math.random() * melodyPitches.length)];

      const melOsc = ctx.createOscillator();
      const melGain = ctx.createGain();

      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(noteFreq, ctx.currentTime);

      melGain.gain.setValueAtTime(0.0001, ctx.currentTime);
      melGain.gain.exponentialRampToValueAtTime(0.012, ctx.currentTime + 0.15);
      melGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.5);

      melOsc.connect(melGain);
      melGain.connect(masterGain);
      melOsc.start();
      melOsc.stop(ctx.currentTime + 2.6);
      activeOscillators.push(melOsc);
    };

    playChord();
    musicInterval = setInterval(playChord, 8000);
    melodyInterval = setInterval(playSubtleNotes, 3000);

    isPlaying = true;
    return true;
  } catch (err) {
    console.warn('Audio autoplay restricted by browser:', err);
    return false;
  }
}

export function stopAmbientSound() {
  if (noiseNode) {
    try { noiseNode.stop(); noiseNode.disconnect(); } catch {}
    noiseNode = null;
  }
  if (musicInterval) {
    clearInterval(musicInterval);
    musicInterval = null;
  }
  if (melodyInterval) {
    clearInterval(melodyInterval);
    melodyInterval = null;
  }
  activeOscillators.forEach((osc) => {
    try { osc.stop(); osc.disconnect(); } catch {}
  });
  activeOscillators = [];
  isPlaying = false;
}

export function setAmbientVolume(vol: number) {
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(Math.max(0, Math.min(1, vol)), audioCtx.currentTime);
  }
}

export function isAudioPlaying(): boolean {
  return isPlaying;
}
