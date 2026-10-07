/* Reusable DAYSLUME editorial cards. Data stays with each page; rendering and motion stay here. */
(() => {
  'use strict';

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');

  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  };

  const buildGraphic = (kind) => {
    const graphic = element('span', `editorial-graphic editorial-graphic--${kind}`);
    graphic.setAttribute('aria-hidden', 'true');
    for (let index = 0; index < 3; index += 1) graphic.append(element('i'));
    return graphic;
  };

  const buildCard = (article, index) => {
    const card = element('article', `editorial-card editorial-card--${article.variant}`);
    const link = element('a', 'editorial-card__link');
    const titleId = `home-editorial-title-${index + 1}`;
    const descriptionId = `home-editorial-description-${index + 1}`;

    link.href = article.href;
    link.setAttribute('aria-labelledby', titleId);
    link.setAttribute('aria-describedby', descriptionId);

    const number = element('span', 'editorial-card__number', article.number);
    number.setAttribute('aria-hidden', 'true');

    const topLine = element('span', 'editorial-card__topline');
    topLine.append(
      element('span', 'editorial-card__category', article.category),
      element('span', 'editorial-card__meta', article.meta)
    );

    const content = element('div', 'editorial-card__content');
    const title = element('h3', 'editorial-card__title', article.title);
    const description = element('p', 'editorial-card__description', article.description);
    const cta = element('span', 'editorial-card__cta');
    const arrow = element('span', 'editorial-card__arrow', '↗');

    title.id = titleId;
    description.id = descriptionId;
    arrow.setAttribute('aria-hidden', 'true');
    cta.append(element('span', '', 'Ler artigo'), arrow);
    content.append(title, description, cta);
    link.append(number, buildGraphic(article.graphic), topLine, content);
    card.append(link);

    return card;
  };

  const resetDecor = (card) => {
    card.style.setProperty('--decor-x', '0px');
    card.style.setProperty('--decor-y', '0px');
    card.style.setProperty('--number-x', '0px');
    card.style.setProperty('--number-y', '0px');
  };

  const addDecorMotion = (card) => {
    card.addEventListener('pointermove', (event) => {
      if (reducedMotion.matches || !precisePointer.matches) return;
      const bounds = card.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
      card.style.setProperty('--decor-x', `${(x * 8).toFixed(2)}px`);
      card.style.setProperty('--decor-y', `${(y * 8).toFixed(2)}px`);
      card.style.setProperty('--number-x', `${(x * 5).toFixed(2)}px`);
      card.style.setProperty('--number-y', `${(y * 5).toFixed(2)}px`);
    });
    card.addEventListener('pointerleave', () => resetDecor(card));
    card.addEventListener('blur', () => resetDecor(card), true);
  };

  const render = (grid, articles) => {
    const fragment = document.createDocumentFragment();
    articles.forEach((article, index) => fragment.append(buildCard(article, index)));
    grid.replaceChildren(fragment);
    grid.querySelectorAll('.editorial-card').forEach(addDecorMotion);
  };

  document.querySelectorAll('[data-editorial-grid]').forEach((grid) => {
    const data = grid.parentElement?.querySelector('[data-editorial-articles]');
    if (!data) return;
    try {
      const articles = JSON.parse(data.textContent);
      if (Array.isArray(articles)) render(grid, articles);
    } catch (error) {
      grid.hidden = true;
      console.error('Não foi possível carregar os conteúdos editoriais.', error);
    }
  });

  reducedMotion.addEventListener('change', () => {
    if (reducedMotion.matches) document.querySelectorAll('.editorial-card').forEach(resetDecor);
  });

  window.DAYSLUMEEditorial = { render };
})();
