/* Music player with volume ducking.
   - Local audio file: decoded and played through Web Audio (works on iPhone, no media-element pausing).
   - Falls back to a normal <audio> element if decoding fails (e.g. page opened from file://).
   - YouTube fallback: IFrame API (no ducking on iOS). */
const Music = (() => {
  const C = CONFIG, D = C.ducking;
  const ios = /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const parse = s => { s = String(s || ''); const m = s.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([\w-]{11})/) || s.match(/^([\w-]{11})$/); return m ? m[1] : ''; };
  const id = parse(C.youtube), useFile = !!C.audioFile;
  let player, ready = false, playing = false, failed = false, pref = C.music.volume, cur = pref, token = 0, warned = false;
  const vids = new Set();

  /* ---------- Web Audio state ---------- */
  let ctx = null, mGain = null, buf = null, srcNode = null;
  let startCtxTime = 0, startOffset = 0, offset = 0;
  let buffered = false;                       // true once the MP3 is decoded and Web Audio mode is active
  const wired = new WeakSet();

  function getCtx() {
    if (ctx) return ctx;
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      ctx = new AC();
      mGain = ctx.createGain();
      mGain.gain.value = cur / 100;
      mGain.connect(ctx.destination);
    } catch (e) { ctx = null; mGain = null; }
    return ctx;
  }

  function unlock() { if (ctx && ctx.state !== 'running') { try { ctx.resume(); } catch (e) {} } }

  // Route a video's sound through the same context so iOS treats everything as one audio session.
  function attachVideo(v) {
    if (!useFile || !v) return;
    const c = getCtx();
    if (!c || wired.has(v)) return;
    wired.add(v);
    try { c.createMediaElementSource(v).connect(c.destination); } catch (e) {}
    unlock();
  }

  function decode(arr) {
    return new Promise((res, rej) => {
      try { const p = ctx.decodeAudioData(arr, res, rej); if (p && p.then) p.then(res, rej); } catch (e) { rej(e); }
    });
  }

  function startBuffer() {
    unlock();
    const s = ctx.createBufferSource();
    s.buffer = buf; s.loop = true; s.connect(mGain);
    const off = offset % buf.duration;
    s.start(0, off);
    srcNode = s; startCtxTime = ctx.currentTime; startOffset = off;
    playing = true; render();
  }
  function pauseBuffer() {
    if (srcNode) {
      offset = (startOffset + (ctx.currentTime - startCtxTime)) % buf.duration;
      try { srcNode.stop(); } catch (e) {}
      srcNode.disconnect(); srcNode = null;
    }
    playing = false; render();
  }

  function initElementFallback() {            // plain <audio> element
    player = new Audio(C.audioFile); player.loop = true; player.preload = 'auto'; player.volume = pref / 100;
    ready = true;
    player.addEventListener('play', () => { playing = true; render(); });
    player.addEventListener('pause', () => { playing = false; render(); });
    player.addEventListener('error', () => { failed = true; ready = false; FX.toast('Audio file not found: check audioFile in config.js and that the file is in assets/audio', 8000); render(); });
    render();
  }

  /* ---------- Init ---------- */
  function init() {
    bind();
    if (useFile) {
      ['pointerdown', 'touchend', 'click'].forEach(ev => addEventListener(ev, unlock, { passive: true }));
      if (getCtx()) {
        render();                              // shows "Loading…"
        fetch(encodeURI(C.audioFile))
          .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.arrayBuffer(); })
          .then(decode)
          .then(b => { buf = b; buffered = true; ready = true; set(cur); render(); })
          .catch(err => { console.warn('Web Audio decode failed, using <audio> fallback', err); buffered = false; initElementFallback(); });
      } else initElementFallback();
      return;
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
      if (buffered) return playing ? pauseBuffer() : startBuffer();
      return playing ? player.pause() : player.play().catch(() => { failed = true; render(); });
    }
    playing ? player.pauseVideo() : player.playVideo();
  }

  function set(v) {
    cur = v;
    try {
      if (buffered) mGain.gain.value = Math.max(0, Math.min(1, v / 100));
      else if (useFile) player.volume = Math.max(0, Math.min(1, v / 100));
      else player.setVolume(Math.round(v));
    } catch (e) {}
  }

  function fadeTo(target, ms) {
    const t = ++token, from = cur, t0 = performance.now();
    (function step(now) {
      if (t !== token) return;                 // a newer fade cancels this one
      const p = Math.min(1, (now - t0) / ms); set(from + (target - from) * p);
      if (p < 1) requestAnimationFrame(step);
    })(t0);
  }

  function setVolume(v) { pref = v; if (!vids.size) { token++; set(v); } syncSliders(); }

  /* ---------- Ducking ---------- */
  function videoStart(k) {
    vids.add(k);
    unlock();
    if (vids.size !== 1 || !D.enabled || !playing) return;
    if (ios && !buffered) {                    // iOS can only duck in Web Audio mode
      if (!warned) { warned = true; FX.toast('This device can\'t lower the music automatically. Use the volume slider or pause the music ♡', 6000); }
      return;
    }
    fadeTo(Math.min(D.level, pref), D.fadeDown);
  }
  function videoEnd(k) {
    if (vids.delete(k) && vids.size === 0 && (!ios || buffered)) fadeTo(pref, D.fadeUp);
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
