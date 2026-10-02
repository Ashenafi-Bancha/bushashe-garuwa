/**
 * Quiet nature sounds for the landscape: a soft breeze and, now and then, a
 * bird. OFF until the visitor switches it on.
 *
 * [NATURE SOUND NEEDED] Until a recording made at Bushaashe Garuwa is supplied,
 * the sound is made by the browser itself (no file is downloaded). To use a
 * recording, put it in frontend/public/audio/ and set its address here; it is
 * then played on a loop instead.
 */
const RECORDING = '';

export type Ambience = { start: () => void; stop: () => void };

type WithWebkit = Window & { webkitAudioContext?: typeof AudioContext };

export function createAmbience(): Ambience {
  let context: AudioContext | null = null;
  let master: GainNode | null = null;
  let birdTimer = 0;
  let player: HTMLAudioElement | null = null;

  /** One short rising-and-falling whistle, somewhere to the left or right */
  const chirp = () => {
    if (!context || !master) return;
    const notes = 2 + Math.floor(Math.random() * 3);
    const base = 2600 + Math.random() * 1400;
    const side = context.createStereoPanner();
    side.pan.value = Math.random() * 1.6 - 0.8;
    side.connect(master);
    for (let i = 0; i < notes; i++) {
      const at = context.currentTime + i * 0.16;
      const voice = context.createOscillator();
      const level = context.createGain();
      voice.type = 'sine';
      voice.frequency.setValueAtTime(base, at);
      voice.frequency.exponentialRampToValueAtTime(base * 1.35, at + 0.05);
      voice.frequency.exponentialRampToValueAtTime(base * 1.08, at + 0.11);
      level.gain.setValueAtTime(0, at);
      level.gain.linearRampToValueAtTime(0.045, at + 0.02);
      level.gain.linearRampToValueAtTime(0, at + 0.12);
      voice.connect(level).connect(side);
      voice.start(at);
      voice.stop(at + 0.14);
    }
    birdTimer = window.setTimeout(chirp, 2500 + Math.random() * 6000);
  };

  const start = () => {
    if (RECORDING) {
      player ??= Object.assign(new Audio(RECORDING), { loop: true, volume: 0.5 });
      void player.play().catch(() => {});
      return;
    }
    const AudioContextClass = window.AudioContext ?? (window as WithWebkit).webkitAudioContext;
    if (!AudioContextClass || context) return;
    context = new AudioContextClass();
    master = context.createGain();
    master.gain.setValueAtTime(0, context.currentTime);
    master.gain.linearRampToValueAtTime(1, context.currentTime + 1.5);
    master.connect(context.destination);

    // the breeze: soft noise with the high end taken off, rising and falling slowly
    const seconds = 3;
    const noise = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const samples = noise.getChannelData(0);
    let last = 0;
    for (let i = 0; i < samples.length; i++) {
      last = (last + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      samples[i] = last * 3.5;
    }
    const source = context.createBufferSource();
    source.buffer = noise;
    source.loop = true;
    const soften = context.createBiquadFilter();
    soften.type = 'lowpass';
    soften.frequency.value = 700;
    const breeze = context.createGain();
    breeze.gain.value = 0.16;
    const swell = context.createOscillator();
    const depth = context.createGain();
    swell.frequency.value = 0.09;
    depth.gain.value = 0.08;
    swell.connect(depth).connect(breeze.gain);
    source.connect(soften).connect(breeze).connect(master);
    source.start();
    swell.start();

    birdTimer = window.setTimeout(chirp, 1800);
  };

  const stop = () => {
    window.clearTimeout(birdTimer);
    player?.pause();
    const closing = context;
    context = null;
    if (closing && master) {
      master.gain.cancelScheduledValues(closing.currentTime);
      master.gain.setValueAtTime(master.gain.value, closing.currentTime);
      master.gain.linearRampToValueAtTime(0, closing.currentTime + 0.4);
      window.setTimeout(() => void closing.close(), 500);
    }
    master = null;
  };

  return { start, stop };
}
