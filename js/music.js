/* Music player with best-effort volume ducking.
   - Local audio file: routed through Web Audio (GainNode) so ducking also works on iPhone.
   - YouTube fallback: uses the IFrame API (no ducking on iOS). */
const Music = (() => {
  const C = CONFIG, D = C.ducking;
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const parse = s => { s = String(s || ''); const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || s.match(/^([\w-]{11})$/); return m ? m[1] : ''; };
  const id = parse(C.youtube), useFile = !!C.audioFile;
  let player, ready = false, playing = false, failed = false, pref = C.music.volume, cur = pref, token = 0, warned = false;
  const vids = new Set();

  /* ---------- Web Audio routing (local file only) ---------- */
  let ctx = null, gain = null;
  const wired = new WeakSet();
  const pending = new Set();          // videos created before the audio context existed

  function wire() {                   // must be called from a user tap
    if (!useFile || ctx) return;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      gain = ctx.createGain();
      gain.gain.value = cur / 100;
      ctx.createMediaElementSource(player).connect(gain);
      gain.connect(ctx.destination);
      pending.forEach(attachVideo);   // hook up videos that were bound earlier
      pending.clear();
    } catch (e) { ctx = null; gain = null; }
  }

  function attachVideo(v) {           // route a video's sound through the same context
    if (!useFile || !v) return;
    if (!ctx) { pending.add(v); return; }
    if (wired.has(v)) return;
    wired.add(v);
    try { ctx.createMediaElementSource(v).connect(ctx.destination); } catch (e) {}
  }

  /* ---------- Init ---------- */
  function init() {
    bind();
    if (useFile) {                                   // local audio file (HTML5 <audio>)
      player = new Audio(C.audioFile); player.loop = true; player.preload = 'auto'; player.volume = pref / 100;
      ready = true;
      player.addEventListener('play', () => { playing = true; render(); });
      player.addEventListener('pause', () => { playing = false; render(); });
      player.addEventListener('error', () => { failed = true; ready = false; FX.toast('Audio file not found: check audioFile in config.js and that the file is in assets/audio', 8000); render(); });
      return render();
    }
    if (!id) return render();
    const s = document.createElement('script'); s.src = 'https://www.youtube.com/iframe_api';
    s.onerror = () => { failed = true; render(); };
    document.head.appendChild(s);
    window.onYouTubeIframeAPIReady = () => {
      const vars = { playsinline: 1, controls: 0, rel: 0, loop: 1, playlist: id };
      if (location.protocol.startsWith('http')) vars.origin = location.origin;
      player = new YT.Player('yt-player', {
        width: 200, height: 200, videoId: id, playerVars: vars,
        events: {
          onReady: () => { ready = true; try { player.setVolume(pref); } catch (e) {} render(); },
          onStateChange: e => { playing = e.data === 1; render(); },
          onError: e => {
            failed = true; console.error('YT error', e.data);
            const why = { 2: 'bad video ID', 5: 'player problem', 100: 'video not found or private', 101: 'the video owner blocks embedding', 150: 'the video owner blocks embedding', 153: 'page not served over http(s) or referrer missing' }[e.data] || 'unknown';
            FX.toast('YouTube error ' + e.data + ': ' + why, 8000); render();
          }
        }
      });
    };
  }

  /* ---------- Playback ---------- */
  function toggle() {
    if (!id && !useFile) return FX.toast('Add a song in js/config.js ♡');
    if (!ready) return FX.toast(failed ? 'Couldn\'t load the player here. Try the YouTube link.' : 'Music is still loading…');
    if (useFile) {
      wire();
      if (ctx && ctx.state === 'suspended') ctx.resume();
      playing ? player.pause() : player.play().catch(() => { failed = true; render(); });
      return;
    }
    playing ? player.pauseVideo() : player.playVideo();
  }

  function set(v) {
    cur = v;
    try {
      if (gain) gain.gain.value = Math.max(0, Math.min(1, v / 100));
      else useFile ? (player.volume = Math.max(0, Math.min(1, v / 100))) : player.setVolume(Math.round(v));
    } catch (e) {}
  }

  function fadeTo(target, ms) {
    const t = ++token, from = cur, t0 = performance.now();
    (function step(now) {
      if (t !== token) return;                     // a newer fade cancels this one
      const p = Math.min(1, (now - t0) / ms); set(from + (target - from) * p);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function setVolume(v) { pref = v; if (!vids.size) { token++; set(v); } syncSliders(); }

  /* ---------- Ducking ---------- */
  function videoStart(k) {
    vids.add(k);
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (vids.size !== 1 || !D.enabled || !playing) return;
    if (ios && !gain) {                            // iOS without Web Audio can't duck
      if (!warned) { warned = true; FX.toast('This device can\'t lower the music automatically. Use the volume slider or pause the music ♡', 6000); }
      return;
    }
    fadeTo(Math.min(D.level, pref), D.fadeDown);
  }
  function videoEnd(k) {
    if (vids.delete(k) && vids.size === 0 && (!ios || gain)) fadeTo(pref, D.fadeUp);
  }

  /* ---------- UI ---------- */
  function syncSliders() { document.querySelectorAll('[data-music-vol]').forEach(s => s.value = pref); }
  function bind() {
    document.querySelectorAll('[data-music-toggle]').forEach(b => b.addEventListener('click', toggle));
    document.querySelectorAll('[data-music-vol]').forEach(s => s.addEventListener('input', () => setVolume(+s.value)));
    document.querySelectorAll('[data-song="title"]').forEach(e => e.textContent = C.song.title);
    document.querySelectorAll('[data-song="artist"]').forEach(e => e.textContent = C.song.artist);
    syncSliders();
  }
  function render() {
    const status = failed ? 'Can\'t play here' : !id && !useFile ? 'No song set yet' : !ready ? 'Loading…' : playing ? 'Playing ♪' : 'Paused';
    document.querySelectorAll('[data-music-status]').forEach(e => e.textContent = status);
    document.querySelectorAll('[data-music-toggle]').forEach(b => {
      b.textContent = playing ? '❚❚' : '▶'; b.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
    });
    document.querySelectorAll('.yt-link').forEach(a => {
      a.hidden = !(id && failed && !useFile); if (id) a.href = 'https://www.youtube.com/watch?v=' + id;
    });
    document.body.classList.toggle('music-on', playing);
  }
  return { init, videoStart, videoEnd, setVolume, attachVideo };
})();
