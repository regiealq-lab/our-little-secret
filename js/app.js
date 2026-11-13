(() => {
  const $ = s => document.querySelector(s);
  const show = id => document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));

  document.querySelectorAll('img[data-ph]').forEach(i => i.src = placeholderArt(i.dataset.ph));
  FX.floatingHearts();

  Auth.init({
    onPin: () => { show('pass'); setTimeout(() => $('#pw').focus(), 700); },
    onPass: () => { show('music'); Music.init(); }
  });

  $('#begin').addEventListener('click', () => {
    show(null);
    document.body.classList.remove('locked');
    $('#story').hidden = false; $('#dock').hidden = false;
    document.querySelectorAll('[data-deck]').forEach(el => {
      new Deck(el, CONFIG.memories[el.dataset.deck] || [], { label: el.dataset.label, style: el.dataset.style, end: el.dataset.end });
    });
    FX.letter(CONFIG.letter); FX.gift(CONFIG.finalMessage); FX.initStory();
    scrollTo(0, 0);
  });
})();