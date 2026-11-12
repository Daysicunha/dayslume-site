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

  // Pointer lighting is now owned by hero-cinematic.js.
  // This module only owns accessible showroom selection.

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
})();
