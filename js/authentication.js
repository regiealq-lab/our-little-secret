const Auth = (() => {
  const C = CONFIG, $ = s => document.querySelector(s);
  const pinPlaceholder = C.devMode && !/^\d{6}$/.test(C.pin);
  const pwPlaceholder = C.devMode && C.password === 'YOUR_SHARED_PASSWORD';
  const okPin = v => pinPlaceholder ? v === '010701' : v === C.pin;
  const okPw = v => {
    const norm = s => C.caseInsensitive ? s.trim().toLowerCase() : s.trim();
    return pwPlaceholder ? v.trim().toLowerCase() === 'svenn' : norm(v) === norm(C.password);
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const pinErrors = ['Hmm, not quite, try again, love ♡', 'Close, but my heart knows better 🙈', 'Nope! Think about us for a sec ♡'];
  const pwErrors = ['Aww, not that one, baby 🙈', 'Try again, I believe in you ♡', 'So close! Read the clue once more.'];
  let buf = '', busy = false, cb = {};

  function init(callbacks) {
    cb = callbacks;
    $('#pin-dev').hidden = !pinPlaceholder; $('#pw-dev').hidden = !pwPlaceholder;
    $('#clue').textContent = C.clue;
    const pad = $('#keypad');
    ['1','2','3','4','5','6','7','8','9','','0','⌫'].forEach(k => {
      if (!k) { pad.appendChild(document.createElement('span')); return; }
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'key'; b.textContent = k;
      b.setAttribute('aria-label', k === '⌫' ? 'Delete' : k);
      b.addEventListener('click', () => k === '⌫' ? del() : press(k));
      pad.appendChild(b);
    });
    addEventListener('keydown', e => {
      if (!$('#pin').classList.contains('active')) return;
      if (/^\d$/.test(e.key)) press(e.key); else if (e.key === 'Backspace') del();
    });
    $('#pw-toggle').addEventListener('click', e => {
      const i = $('#pw'), show = i.type === 'password';
      i.type = show ? 'text' : 'password';
      e.currentTarget.setAttribute('aria-pressed', show); e.currentTarget.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
    });
    $('#pass-form').addEventListener('submit', e => { e.preventDefault(); checkPw(); });
  }

  const paint = () => document.querySelectorAll('#dots i').forEach((d, i) => d.classList.toggle('on', i < buf.length));
  const msg = (el, t) => { $(el).textContent = t; };
  function press(d) { if (busy || buf.length >= 6) return; buf += d; paint(); if (buf.length === 6) setTimeout(checkPin, 200); }
  function del() { if (busy) return; buf = buf.slice(0, -1); paint(); }

  function checkPin() {
    busy = true;
    if (okPin(buf)) {
      $('#lock').classList.add('open'); msg('#pin-msg', 'I knew you\'d remember. ♡'); FX.sparkleAt($('#lock'));
      setTimeout(() => { cb.onPin(); }, 1800);
    } else {
      const d = $('#dots'); d.classList.add('shake'); msg('#pin-msg', pick(pinErrors));
      setTimeout(() => { d.classList.remove('shake'); buf = ''; paint(); busy = false; }, 600);
    }
  }

  function checkPw() {
    const f = $('#pass-form'), v = $('#pw').value;
    if (okPw(v)) {
      f.classList.add('ok'); msg('#pw-msg', 'Welcome to our little world. ♡'); FX.sparkleAt($('#pw'));
      setTimeout(() => cb.onPass(), 1900);
    } else {
      msg('#pw-msg', pick(pwErrors)); f.classList.remove('shake'); void f.offsetWidth; f.classList.add('shake'); $('#pw').focus();
    }
  }
  return { init };
})();
