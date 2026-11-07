(() => {
  'use strict';
  const palette = { red: '#e52525', yellow: '#ffdb21', green: '#13a538' };
  const words = { red: 'STOP', yellow: 'SLOW', green: 'GO!' };
  const screen = document.getElementById('screen');
  const word = document.getElementById('word');
  const toolbar = document.getElementById('toolbar');
  const hint = document.getElementById('hint');
  const autoButton = document.getElementById('auto');
  const speed = document.getElementById('speed');
  const speedLabel = document.getElementById('speedLabel');
  let current = 'green';
  let running = false;
  let timer = null;
  let hideTimer = null;
  let wakeLock = null;
  const speeds = {
    1: { label: 'Very slow', min: 4500, max: 9500 },
    2: { label: 'Slow', min: 3000, max: 6500 },
    3: { label: 'Normal', min: 1600, max: 4500 },
    4: { label: 'Fast', min: 900, max: 2700 },
    5: { label: 'Very fast', min: 500, max: 1500 }
  };
  function randomInt(max) {
    if (globalThis.crypto?.getRandomValues) {
      const n = new Uint32Array(1);
      crypto.getRandomValues(n);
      return Math.floor((n[0] / 4294967296) * max);
    }
    return Math.floor(Math.random() * max);
  }
  function setColor(color) {
    current = color;
    screen.style.backgroundColor = palette[color];
    screen.className = color;
    screen.setAttribute('aria-label', `${color} light`);
    word.textContent = words[color];
    document.querySelector('meta[name="theme-color"]').content = palette[color];
  }
  function chooseNext() {
    const options = Object.keys(palette).filter(color => color !== current);
    setColor(options[randomInt(options.length)]);
  }
  function schedule() {
    clearTimeout(timer);
    if (!running) return;
    const config = speeds[speed.value];
    const wait = config.min + randomInt(config.max - config.min + 1);
    timer = setTimeout(() => { chooseNext(); schedule(); }, wait);
  }
  async function keepAwake() {
    try { if ('wakeLock' in navigator && document.visibilityState === 'visible') wakeLock = await navigator.wakeLock.request('screen'); } catch (_) { /* not supported or permission denied */ }
  }
  async function startAuto() {
    running = true;
    autoButton.textContent = '■ Stop Auto';
    autoButton.classList.add('active');
    autoButton.setAttribute('aria-pressed', 'true');
    await keepAwake();
    if (running) schedule();
    hideSoon();
  }
  function stopAuto() {
    running = false;
    clearTimeout(timer);
    autoButton.textContent = '▶ Start Auto';
    autoButton.classList.remove('active');
    autoButton.setAttribute('aria-pressed', 'false');
    if (wakeLock) { wakeLock.release().catch(() => {}); wakeLock = null; }
  }
  function showControls() {
    toolbar.classList.remove('hidden');
    hint.classList.remove('gone');
    clearTimeout(hideTimer);
    if (running) hideSoon();
  }
  function hideControls() {
    toolbar.classList.add('hidden');
    hint.classList.add('gone');
    clearTimeout(hideTimer);
  }
  function hideSoon() {
    clearTimeout(hideTimer);
    hideTimer = setTimeout(hideControls, 2500);
  }
  document.querySelectorAll('[data-color]').forEach(button => {
    button.addEventListener('click', () => { stopAuto(); setColor(button.dataset.color); hideControls(); });
  });
  autoButton.addEventListener('click', () => { if (running) { stopAuto(); showControls(); } else startAuto(); });
  document.getElementById('hide').addEventListener('click', hideControls);
  screen.addEventListener('click', () => { if (toolbar.classList.contains('hidden')) showControls(); else hideControls(); });
  document.getElementById('fullscreen').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else if (document.documentElement.requestFullscreen) await document.documentElement.requestFullscreen();
      else hideControls(); // iPhone Safari: use Add to Home Screen for app-style full screen
    } catch (_) { hideControls(); }
  });
  speed.addEventListener('input', () => { speedLabel.textContent = speeds[speed.value].label; if (running) schedule(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && running) { keepAwake(); schedule(); }
    else if (document.visibilityState === 'hidden') clearTimeout(timer);
  });
  document.addEventListener('keydown', event => {
    if (event.target.tagName === 'INPUT') return;
    const keys = { r: 'red', y: 'yellow', g: 'green' };
    if (keys[event.key.toLowerCase()]) { stopAuto(); setColor(keys[event.key.toLowerCase()]); hideControls(); }
    if (event.code === 'Space') { event.preventDefault(); if (running) stopAuto(); else startAuto(); }
  });
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js').catch(() => {});
  setColor('green');
})();
