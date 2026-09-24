(()=>{'use strict';const start=()=>{if(!matchMedia('(prefers-reduced-motion: reduce)').matches&&'IntersectionObserver'in window){const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('days-reveal');io.unobserve(e.target)}}),{threshold:.07});document.querySelectorAll('.days-card,.step').forEach(el=>io.observe(el));document.documentElement.classList.add('days-motion')}const filters=[...document.querySelectorAll('.days-filterbar .days-filter')];if(!filters.length)return;const sec=filters[0].closest('section'),cards=[...sec.querySelectorAll('.days-filter-grid [data-project-kind]')],status=sec.querySelector('.days-filter-status');filters.forEach(b=>b.addEventListener('click',()=>{const kind=b.dataset.filter;filters.forEach(x=>{const on=x===b;x.classList.toggle('is-selected',on);x.setAttribute('aria-pressed',String(on))});let visible=0;cards.forEach(card=>{card.hidden=!(kind==='all'||card.dataset.projectKind===kind);if(!card.hidden)visible++});if(status)status.textContent=visible===1?'1 projeto exibido':visible+' projetos exibidos'}))};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',start,{once:true});else start()})();
/* The complete navigation remains visible if JavaScript is unavailable. */
(() => {
  'use strict';
  const header = document.querySelector('.header');
  const button = header?.querySelector('.days-menu-toggle');
  const menu = header?.querySelector('#menu-principal');
  if (!button || !menu) return;
  const mobile = matchMedia('(max-width: 1000px)');
  const close = (restoreFocus = false) => {
    menu.classList.remove('is-open');
    button.setAttribute('aria-expanded', 'false');
    button.setAttribute('aria-label', 'Abrir menu');
    if (restoreFocus) button.focus();
  };
  button.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(open));
    button.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => close()));
  document.addEventListener('click', event => { if (!header.contains(event.target)) close(); });
  document.addEventListener('keydown', event => {
    if (!mobile.matches || !menu.classList.contains('is-open')) return;
    if (event.key === 'Escape') { close(true); return; }
    if (event.key !== 'Tab') return;
    const last = [...menu.querySelectorAll('a[href]')].at(-1);
    if (event.shiftKey && document.activeElement === button) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); button.focus(); }
  });
  mobile.addEventListener('change', () => close());
  header.classList.add('days-nav-ready');
})();
