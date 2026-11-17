/* Material sounds, synthesised. Nothing is downloaded.
 *   paper — noise burst through a highpass, 40 ms
 *   wood  — damped 180 Hz sine + a noise transient
 *   glass — damped 2.4 kHz sine with a short noise attack
 *   metal — two detuned partials, long decay, they beat
 */
(() => {
  let ctx = null, on = true, count = 0;
  const stateOut = document.getElementById('m-state');
  const nOut = document.getElementById('m-n');

  function ac() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') ctx.resume();
    stateOut.textContent = ctx.state;
    return ctx;
  }

  function noise(c, dur, hp, gain, when) {
    const n = Math.floor(c.sampleRate * dur);
    const buf = c.createBuffer(1, n, c.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / n);
    const src = c.createBufferSource(); src.buffer = buf;
    const f = c.createBiquadFilter(); f.type = hp > 800 ? 'highpass' : 'lowpass'; f.frequency.value = hp;
    const g = c.createGain(); g.gain.value = gain;
    src.connect(f); f.connect(g); g.connect(c.destination);
    src.start(when);
  }

  function tone(c, freq, dur, gain, when, detune) {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = freq;
    if (detune) o.detune.value = detune;
    const g = c.createGain();
    g.gain.setValueAtTime(0.0001, when);
    g.gain.exponentialRampToValueAtTime(gain, when + 0.004);
    g.gain.exponentialRampToValueAtTime(0.0001, when + dur);
    o.connect(g); g.connect(c.destination);
    o.start(when); o.stop(when + dur + 0.02);
    return o;
  }

  const SOUND = {
    paper(c, t) { noise(c, 0.05, 1800, 0.16, t); },
    wood(c, t) { tone(c, 180, 0.14, 0.28, t); noise(c, 0.012, 500, 0.12, t); },
    glass(c, t) { tone(c, 2400, 0.28, 0.16, t); noise(c, 0.02, 3000, 0.08, t); },
    metal(c, t) { tone(c, 1180, 1.5, 0.09, t, 0); tone(c, 1180, 1.5, 0.07, t, 7); noise(c, 0.02, 2500, 0.06, t); },
  };

  document.querySelectorAll('.pad').forEach((pad) => {
    pad.addEventListener('pointerdown', () => {
      if (!on) return;
      const c = ac();
      SOUND[pad.dataset.mat](c, c.currentTime);
      pad.classList.add('hit');
      setTimeout(() => pad.classList.remove('hit'), 520);
      nOut.textContent = ++count;
    });
  });

  const toggle = document.getElementById('toggle');
  toggle.addEventListener('click', () => {
    on = !on;
    toggle.classList.toggle('on', on);
    toggle.textContent = on ? 'Sound on' : 'Sound off';
  });

  document.documentElement.dataset.ready = '1';
})();
