/* DAYSLUME 3.3 — cinematic home integration. No scroll pinning or hidden CTAs. */
(() => {
  'use strict';
  const hero = document.querySelector('.hero--cinematic[data-cinema33-home]');
  const section = document.querySelector('#produtos');
  const showroom = section?.querySelector('[data-cinema33-showroom]');
  if (!hero || !section || !showroom) return;
  const cards = {
    vitrini: section.querySelector('.solution-card.solution-vitrini'),
    engreni: section.querySelector('.solution-card.solution-engreni')
  };
  if (!cards.vitrini || !cards.engreni) return;

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = window.matchMedia('(hover: hover) and (pointer: fine) and (min-width: 901px)');
  const atmosphere = hero.querySelector('.cinema33-atmosphere');
  let frame = 0;
  let x = 72;
  let y = 45;

  function paintPointer() {
    frame = 0;
    if (!atmosphere || media.matches || !pointer.matches || document.hidden) return;
    atmosphere.style.setProperty('--cinema33-pointer-x', x.toFixed(1) + '%');
    atmosphere.style.setProperty('--cinema33-pointer-y', y.toFixed(1) + '%');
  }
  function move(event) {
    if (media.matches || !pointer.matches || !atmosphere) return;
    const b = hero.getBoundingClientRect();
    x = Math.min(100, Math.max(0, ((event.clientX - b.left) / Math.max(1, b.width)) * 100));
    y = Math.min(100, Math.max(0, ((event.clientY - b.top) / Math.max(1, b.height)) * 100));
    if (!frame) frame = requestAnimationFrame(paintPointer);
  }
  function resetPointer() {
    if (frame) cancelAnimationFrame(frame);
    frame = 0;
    atmosphere?.style.removeProperty('--cinema33-pointer-x');
    atmosphere?.style.removeProperty('--cinema33-pointer-y');
  }
  hero.addEventListener('pointermove', move, {passive:true});
  hero.addEventListener('pointerleave', resetPointer);
  media.addEventListener('change', resetPointer);
  pointer.addEventListener('change', resetPointer);

  const messages = {
    all: 'Duas famílias de produtos. Explore a apresentação e as interfaces de cada uma.',
    vitrini: 'VITRINI em destaque: apresentação comercial, descoberta e caminhos de contato.',
    engreni: 'ENGRENI em destaque: agendamento, organização e operação do negócio.'
  };
  const choices = [...showroom.querySelectorAll('[data-cinema33-choice]')];
  const caption = showroom.querySelector('[data-cinema33-caption]');
  function select(value) {
    if (!Object.prototype.hasOwnProperty.call(messages, value)) return;
    section.classList.toggle('cinema33-focused', value !== 'all');
    Object.entries(cards).forEach(([name, card]) => {
      card.classList.toggle('cinema33-spotlight', value === name);
      card.classList.toggle('cinema33-muted', value !== 'all' && value !== name);
    });
    choices.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.cinema33Choice === value));
    });
    if (caption) caption.textContent = messages[value];
  }
  choices.forEach(button => button.addEventListener('click', () => select(button.dataset.cinema33Choice)));
  select('all');
  showroom.hidden = false;

  // No scroll-triggered invisibility: content and anchors always remain available.
  window.addEventListener('pagehide', () => {
    resetPointer();
  }, {once:true});
})();
