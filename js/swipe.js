/* Swipeable memory card stack. Left = next, right = previous (navigation only). */
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

class Deck {
  constructor(root, items, opts = {}) {
    this.root = root; this.end = opts.end || ''; this.items = items; this.i = 0; this.busy = false; this.vid = null;
    root.classList.add('deck', opts.style || 'plain');
    root.innerHTML = `<div class="stage" tabindex="0" role="group" aria-roledescription="carousel" aria-label="${esc(opts.label)}"></div>
      <div class="deck-ui"><button class="rnd" data-d="-1" aria-label="Previous memory">‹</button><span class="count" aria-live="polite"></span><button class="rnd" data-d="1" aria-label="Next memory">›</button></div>
      <p class="end-msg" aria-live="polite"></p>`;
    this.stage = root.querySelector('.stage'); this.count = root.querySelector('.count');
    root.querySelectorAll('[data-d]').forEach(b => b.addEventListener('click', () => this.fly(+b.dataset.d)));
    this.stage.addEventListener('keydown', e => {
      if (e.key === 'ArrowRight') { e.preventDefault(); this.fly(1); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); this.fly(-1); }
    });
    this.render();
  }

  card(m, k) {
    const c = document.createElement('div'); c.className = 'card';
    const img = m.type === 'video' ? (m.thumb || placeholderArt(m.title)) : (m.src || placeholderArt(m.title));
    const isVid = m.type === 'video', vid = isVid && k === 0, auto = isVid && !m.thumb && m.src;
    if (auto) c.classList.add('nothumb');   // no thumb: show the video's first frame as the preview
    const vsrc = m.src ? esc(m.src) + (auto ? '#t=0.1' : '') : '';
    const videoEl = (vid || auto) ? `<video playsinline ${k ? 'muted' : ''} preload="${auto ? 'metadata' : 'none'}" ${auto ? '' : `poster="${esc(img)}"`} ${vsrc ? `src="${vsrc}"` : ''}></video>` : '';
    const btns = vid ? '<button class="vplay" aria-label="Play video">▶</button><button class="vfs" aria-label="Fullscreen video">⛶</button>' : '';
    c.innerHTML = `<div class="media"><img src="${esc(img)}" alt="${esc(m.title)}" draggable="false" loading="${k ? 'lazy' : 'eager'}" decoding="async">
      ${videoEl}${btns}</div>
      <div class="cap"><h3>${esc(m.title)}</h3><p>${esc(m.caption)}</p>${m.date ? `<small>${esc(m.date)}</small>` : ''}</div>`;
    if (k) {
      c.setAttribute('aria-hidden', 'true'); c.inert = true;
      c.style.transform = `translateY(${k * 9}px) rotate(${(k % 2 ? 1 : -1) * k * 2.6}deg) scale(${1 - k * .045})`;
    }
    return c;
  }

  render() {
    this.stopVideo(); this.stage.innerHTML = '';
    for (let k = 2; k >= 0; k--) { const m = this.items[this.i + k]; if (m) { const c = this.card(m, k); this.stage.appendChild(c); if (!k) this.active = c; } }
    this.root.querySelector('.end-msg').textContent = (this.end && this.i === this.items.length - 1) ? this.end : '';
    this.count.textContent = `Memory ${String(this.i + 1).padStart(2, '0')} / ${String(this.items.length).padStart(2, '0')}`;
    const n = this.items[this.i + 1]; if (n && n.type === 'image' && n.src) new Image().src = n.src;
    this.bind(this.active, this.items[this.i]);
  }

  stopVideo() { if (this.vid) { this.vid.pause(); Music.videoEnd(this.vid); this.vid = null; } }

  bind(c, m) {
    const v = c.querySelector('video');
    if (v) {
      const btn = c.querySelector('.vplay');
      btn.onclick = () => {
        if (!m.src) return FX.toast('Add your video file path in js/config.js ♡');
        v.paused ? v.play() : v.pause();
      };
      c.querySelector('.vfs').onclick = () => (v.requestFullscreen || v.webkitEnterFullscreen || (() => {})).call(v);
      v.onplay = () => { this.vid = v; c.classList.add('playing'); btn.textContent = '❚❚'; btn.setAttribute('aria-label', 'Pause video'); Music.videoStart(v); };
      const end = () => { c.classList.remove('playing'); btn.textContent = '▶'; btn.setAttribute('aria-label', 'Play video'); Music.videoEnd(v); };
      v.onpause = end; v.onended = end;
    }
    let sx = null, sy = 0, dx = 0, lock = null, t0 = 0, pid = 0, raf = 0;
    const apply = () => { raf = 0; c.style.transform = `translate(${dx}px,${dx * .04}px) rotate(${dx / 18}deg)`; c.style.setProperty('--sh', Math.min(Math.abs(dx) / 6, 30) + 'px'); };
    c.onpointerdown = e => {
      if (this.busy || e.target.closest('button')) return;
      sx = e.clientX; sy = e.clientY; dx = 0; lock = null; t0 = performance.now(); pid = e.pointerId;
    };
    c.onpointermove = e => {
      if (sx === null || e.pointerId !== pid) return;
      const ax = e.clientX - sx, ay = e.clientY - sy;
      if (!lock && (Math.abs(ax) > 8 || Math.abs(ay) > 8)) lock = Math.abs(ax) > Math.abs(ay) * 1.2 ? 'x' : 'y';
      if (lock !== 'x') return;
      if (!c.hasPointerCapture(pid)) { c.setPointerCapture(pid); c.classList.add('drag'); }
      dx = ax; if (!raf) raf = requestAnimationFrame(apply);
    };
    c.onpointerup = c.onpointercancel = e => {
      if (sx === null) return;
      const wasLock = lock, vel = Math.abs(dx) / Math.max(1, performance.now() - t0); sx = null;
      c.classList.remove('drag');
      if (wasLock === 'x') {
        if (e.type === 'pointerup' && (Math.abs(dx) > 90 || (vel > .5 && Math.abs(dx) > 30))) this.fly(dx < 0 ? 1 : -1, dx);
        else this.snap(c);
      } else if (!wasLock && e.type === 'pointerup' && m.type === 'image') FX.lightbox(m.src || placeholderArt(m.title), m.title);
    };
  }

  snap(c) { c.style.transform = ''; c.style.removeProperty('--sh'); }

  fly(dir, from = 0) {
    const n = this.i + dir, c = this.active;
    if (this.busy || !c) return;
    if (n < 0 || n >= this.items.length) { this.snap(c); return; }
    this.busy = true; this.stopVideo();
    const out = dir > 0 ? -1 : 1, d = FX.reduce ? 0 : 380;
    c.classList.remove('drag');
    c.style.transition = `transform ${d}ms ease-in, opacity ${d}ms`;
    c.style.transform = `translate(${out * 120}vw,${from * .04}px) rotate(${out * 28}deg)`; c.style.opacity = '0';
    setTimeout(() => { this.i = n; this.render(); this.busy = false; }, d);
  }
}