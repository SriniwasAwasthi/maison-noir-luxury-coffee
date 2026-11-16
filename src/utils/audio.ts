// Pristine Procedural Web Audio Engine for Maison Noir
// Provides 3 distinct, fluent, and tranquil ambient modes with zero echo and silky smooth transitions:
// 1. 'vinyl': Vintage 1960s vinyl warmth & cyclic acoustic jazz harmony
// 2. 'espresso': Roastery Slow Bar - gentle espresso warmth, steam resonance & deep mellow chords
// 3. 'rain': Rain on Stained Glass - soothing rain whisper & tranquil mellow piano droplets

let audioCtx: AudioContext | null = null;
let isPlaying = false;
let currentMode: 'vinyl' | 'espresso' | 'rain' = 'vinyl';
let currentVolume = 0.28;

let masterGain: GainNode | null = null;
let ambientGain: GainNode | null = null;
let musicGain: GainNode | null = null;

let noiseSource: AudioBufferSourceNode | null = null;
let noiseFilter: BiquadFilterNode | null = null;

let chordTimer: any = null;
let melodyTimer: any = null;
let activeOscillators: { osc: OscillatorNode; gain: GainNode }[] = [];

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
    currentMode = mode;
    currentVolume = volume;

    // Gracefully stop previous timers and fade out active nodes
    stopAmbientSound(true);

    // Master bus
    masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);

    // Sub-buses for clean separation
    ambientGain = ctx.createGain();
    musicGain = ctx.createGain();

    ambientGain.connect(masterGain);
    musicGain.connect(masterGain);

    // ----------------------------------------------------
    // 1. Procedural Ambient Texture Generator (Pink/Brown noise)
    // ----------------------------------------------------
    const bufferSize = ctx.sampleRate * 4; // 4s seamless loop
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);

    // Generate gentle brown/pink noise (softer on the ears than white noise)
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;

      if (mode === 'vinyl') {
        // Pure smooth whisper-soft warmth (no harsh crackle, zero echo)
        data[i] = pink * 0.008;
      } else if (mode === 'espresso') {
        // Soft continuous roastery steam hiss
        data[i] = pink * 0.012;
      } else {
        // Soft soothing rain on glass
        data[i] = pink * 0.016;
      }
    }

    noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    noiseFilter = ctx.createBiquadFilter();

    if (mode === 'vinyl') {
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(450, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.5, ctx.currentTime);
      ambientGain.gain.setValueAtTime(0.08, ctx.currentTime);
    } else if (mode === 'espresso') {
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(650, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.5, ctx.currentTime);
      ambientGain.gain.setValueAtTime(0.12, ctx.currentTime);
    } else {
      // rain mode
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(800, ctx.currentTime);
      noiseFilter.Q.setValueAtTime(0.6, ctx.currentTime);
      ambientGain.gain.setValueAtTime(0.15, ctx.currentTime);
    }

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(ambientGain);
    noiseSource.start();

    // ----------------------------------------------------
    // 2. Pure Fluent Acoustic Chords (No echo, rich harmonic voicings)
    // ----------------------------------------------------
    // Distinct chords per mode:
    const vinylChords = [
      [130.81, 196.00, 246.94, 293.66, 392.00], // Cmaj9
      [110.00, 164.81, 220.00, 261.63, 329.63], // Am9
      [146.83, 220.00, 261.63, 311.13, 369.99], // Dm9
      [98.00, 146.83, 220.00, 246.94, 329.63],  // G13
      [174.61, 220.00, 261.63, 329.63, 392.00], // Fmaj7#11
      [164.81, 196.00, 246.94, 293.66, 349.23], // Em7
    ];

    const espressoChords = [
      [110.00, 164.81, 220.00, 277.18, 329.63], // Amaj9 (warm caramel)
      [146.83, 196.00, 246.94, 293.66, 369.99], // Dmaj9 (amber warmth)
      [123.47, 185.00, 220.00, 293.66, 369.99], // Bm7 (deep roast)
      [82.41, 123.47, 164.81, 246.94, 329.63],  // E11 (rich crema)
    ];

    const rainChords = [
      [130.81, 164.81, 196.00, 246.94], // Cmaj7 (clear droplet)
      [110.00, 130.81, 164.81, 196.00], // Am7 (reflective mist)
      [87.31, 130.81, 174.61, 220.00],  // Fmaj7 (gentle puddle)
      [98.00, 146.83, 196.00, 246.94],  // G6 (tranquil horizon)
    ];

    const currentChordSet = mode === 'vinyl' ? vinylChords : mode === 'espresso' ? espressoChords : rainChords;
    let chordIndex = 0;

    const playChord = () => {
      if (!ctx || !musicGain) return;
      const now = ctx.currentTime;

      // Clean up previous oscillators with 1.2s crossfade
      activeOscillators.forEach(({ osc, gain }) => {
        try {
          gain.gain.setValueAtTime(gain.gain.value, now);
          gain.gain.exponentialRampToValueAtTime(0.00001, now + 1.2);
          osc.stop(now + 1.3);
        } catch {}
      });
      activeOscillators = [];

      const freqs = currentChordSet[chordIndex % currentChordSet.length];
      chordIndex++;

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        // Pure sinusoidal warmth - zero echo, zero distortion, fluent acoustic flow
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        // Silent & fluent swelling envelope: soft 2.8s swell, seamless decay
        const peakGain = (mode === 'rain' ? 0.012 : 0.016) / Math.sqrt(idx + 1);
        gainNode.gain.setValueAtTime(0.00001, now);
        gainNode.gain.exponentialRampToValueAtTime(peakGain, now + 2.8);
        gainNode.gain.exponentialRampToValueAtTime(0.00001, now + 8.4);

        osc.connect(gainNode);
        gainNode.connect(musicGain!);
        osc.start(now);
        osc.stop(now + 8.6);

        activeOscillators.push({ osc, gain: gainNode });
      });
    };

    // ----------------------------------------------------
    // 3. Subtle Melodic Accents (Silent & Fluent Piano Droplets)
    // ----------------------------------------------------
    const playMelodyNote = () => {
      if (!ctx || !musicGain || Math.random() > 0.5) return;
      const now = ctx.currentTime;

      const pentatonicPitches = mode === 'rain'
        ? [523.25, 587.33, 659.25, 783.99, 880.00] // C, D, E, G, A
        : [440.00, 493.88, 554.37, 659.25, 739.99]; // A, B, C#, E, F#

      const freq = pentatonicPitches[Math.floor(Math.random() * pentatonicPitches.length)];

      const melOsc = ctx.createOscillator();
      const melGain = ctx.createGain();

      melOsc.type = 'sine';
      melOsc.frequency.setValueAtTime(freq, now);

      melGain.gain.setValueAtTime(0.00001, now);
      melGain.gain.linearRampToValueAtTime(0.008, now + 0.05); // Soft 50ms attack, zero click
      melGain.gain.exponentialRampToValueAtTime(0.00001, now + 3.2);

      melOsc.connect(melGain);
      melGain.connect(musicGain);
      melOsc.start(now);
      melOsc.stop(now + 3.4);

      activeOscillators.push({ osc: melOsc, gain: melGain });
    };

    playChord();
    chordTimer = setInterval(playChord, 6800);
    melodyTimer = setInterval(playMelodyNote, 4200);

    isPlaying = true;
    return true;
  } catch (err) {
    console.warn('Audio autoplay prevented or error:', err);
    return false;
  }
}

export function stopAmbientSound(keepContext = false) {
  if (noiseSource) {
    try {
      noiseSource.stop();
      noiseSource.disconnect();
    } catch {}
    noiseSource = null;
  }
  if (noiseFilter) {
    try { noiseFilter.disconnect(); } catch {}
    noiseFilter = null;
  }
  if (chordTimer) {
    clearInterval(chordTimer);
    chordTimer = null;
  }
  if (melodyTimer) {
    clearInterval(melodyTimer);
    melodyTimer = null;
  }
  activeOscillators.forEach(({ osc, gain }) => {
    try {
      osc.stop();
      osc.disconnect();
      gain.disconnect();
    } catch {}
  });
  activeOscillators = [];
  isPlaying = false;
}

export function setAmbientVolume(vol: number) {
  currentVolume = Math.max(0, Math.min(1, vol));
  if (masterGain && audioCtx) {
    masterGain.gain.setValueAtTime(currentVolume, audioCtx.currentTime);
  }
}

export function isAudioPlaying(): boolean {
  return isPlaying;
}

export function getCurrentAudioMode(): 'vinyl' | 'espresso' | 'rain' {
  return currentMode;
}
