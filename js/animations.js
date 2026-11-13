const FX = (() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = s => document.querySelector(s);

  function toast(msg, ms = 4200) {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast.id); toast.id = setTimeout(() => t.classList.remove('show'), ms);
  }

  function sparkle(x, y, n = 10) {
    if (reduce) return;
    for (let i = 0; i < n; i++) {
      const s = document.createElement('span');
      s.className = 'sparkle'; s.textContent = i % 2 ? '✦' : '♡';
      const a = Math.random() * Math.PI * 2, d = 40 + Math.random() * 70;
      s.style.cssText = `left:${x}px;top:${y}px;--dx:${Math.cos(a) * d}px;--dy:${Math.sin(a) * d}px`;
      document.body.appendChild(s); setTimeout(() => s.remove(), 1100);
    }
  }
  const sparkleAt = el => { const r = el.getBoundingClientRect(); sparkle(r.left + r.width / 2, r.top + r.height / 2); };

  function floatingHearts() {
    if (reduce) return;
    const box = $('.bg-hearts');
    for (let i = 0; i < 7; i++) {
      const h = document.createElement('span');
      h.textContent = '♡';
      h.style.cssText = `left:${8 + i * 13}%;font-size:${14 + (i % 3) * 8}px;animation-duration:${14 + i * 2}s;animation-delay:${-i * 3}s`;
      box.appendChild(h);
    }
  }

  function initStory() {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));

    const bar = $('#progress'), par = [...document.querySelectorAll('.parallax')];
    let tick = false;
    const update = () => {
      tick = false;
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`;
      if (!reduce) par.forEach(p => {
        const r = p.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) return;
        p.style.transform = `translateY(${(r.top - innerHeight / 2) * -p.dataset.speed}px) scale(1.12)`;
      });
    };
    addEventListener('scroll', () => { if (!tick) { tick = true; requestAnimationFrame(update); } }, { passive: true });
    update();
  }

  function letter(lines) {
    const env = $('#envelope'), paper = $('#paper');
    paper.innerHTML = lines.map(() => '<p></p>').join('');
    [...paper.children].forEach((p, i) => p.textContent = lines[i]);
    env.addEventListener('click', () => {
      if (env.classList.contains('open')) return;
      env.classList.add('open'); env.setAttribute('aria-expanded', 'true');
      $('.env-label').textContent = 'With all my love';
      sparkleAt(env);
      setTimeout(() => {
        paper.classList.add('open');
        [...paper.children].forEach((p, i) => setTimeout(() => p.classList.add('show'), 700 + i * (reduce ? 0 : 1100)));
      }, reduce ? 0 : 800);
    });
  }

  function gift(msg) {
    const g = $('#gift'), s = $('#surprise');
    s.textContent = msg;
    g.addEventListener('click', () => {
      if (g.classList.contains('open')) return;
      g.classList.add('open'); g.setAttribute('aria-expanded', 'true');
      sparkleAt(g); setTimeout(() => sparkleAt(g), 350);
      setTimeout(() => s.classList.add('show'), reduce ? 0 : 700);
    });
  }

  function lightbox(src, alt) {
    const lb = $('#lightbox'), img = lb.querySelector('img'), close = lb.querySelector('button');
    img.src = src; img.alt = alt || ''; lb.hidden = false; close.focus();
    const off = () => { lb.hidden = true; removeEventListener('keydown', esc); };
    const esc = e => e.key === 'Escape' && off();
    lb.onclick = off; addEventListener('keydown', esc);
  }

  return { toast, sparkle, sparkleAt, floatingHearts, initStory, letter, gift, lightbox, reduce };
})();
