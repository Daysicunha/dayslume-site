/* Progressive enhancement only. Navigation, content and direct contact work without JS. */
(() => {
  'use strict';
  const root = document.documentElement;
  const menuButton = document.querySelector('.menu-toggle');
  const menu = document.querySelector('#menu-principal');
  const mobile = window.matchMedia('(max-width: 1180px)');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  let paused = false;
  let rotationTimer;
  let rotationIndex = 0;
  const terms = [...document.querySelectorAll('.rotating-term')];
  const closeMenu = (returnFocus = false) => {
    menu?.classList.remove('open');
    menuButton?.setAttribute('aria-expanded', 'false');
    menuButton?.setAttribute('aria-label', 'Abrir menu');
    if (returnFocus) menuButton?.focus();
  };
  menuButton?.addEventListener('click', () => {
    const open = menu.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  });
  menu?.querySelectorAll('a').forEach(link => link.addEventListener('click', () => closeMenu()));
  document.addEventListener('click', event => {
    if (!event.target.closest('.site-header')) closeMenu();
  });
  document.addEventListener('keydown', event => {
    if (!menu?.classList.contains('open') || !mobile.matches) return;
    if (event.key === 'Escape') { closeMenu(true); return; }
    if (event.key !== 'Tab') return;
    const controls = [menuButton, ...menu.querySelectorAll('a[href], button')];
    const first = controls[0], last = controls[controls.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });
  mobile.addEventListener('change', () => closeMenu());
  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
  const syncMotion = () => {
    clearInterval(rotationTimer);
    const stopped = paused || reduced.matches || document.hidden;
    root.classList.toggle('motion-paused', stopped);
    if (motionButton) {
      motionButton.hidden = reduced.matches;
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.querySelector('.motion-label').textContent = paused ? 'Ativar animações' : 'Pausar animações';
      motionButton.querySelector('.motion-icon').textContent = paused ? '▷' : 'Ⅱ';
    }
    if (!stopped && terms.length > 1) rotationTimer = setInterval(() => {
      terms[rotationIndex].classList.remove('is-current');
      rotationIndex = (rotationIndex + 1) % terms.length;
      terms[rotationIndex].classList.add('is-current');
    }, 3400);
  };
  motionButton?.addEventListener('click', () => { paused = !paused; syncMotion(); });
  reduced.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  syncMotion();
  if ('IntersectionObserver' in window && !reduced.matches) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.08 });
    document.querySelectorAll('.service-card,.solution-card,.project-card,.migrated-blog-grid article').forEach(el => {
      el.classList.add('motion-entry'); observer.observe(el);
    });
  }
  const form = document.querySelector('#contact-form');
  const status = document.querySelector('#form-status');
  const continuation = document.querySelector('#whatsapp-submit');
  form?.addEventListener('submit', event => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const value = key => String(data.get(key) || '').trim();
    const message = ['Olá! Vim pelo site da DAYSLUME.', '', `Nome: ${value('nome')}`, `E-mail: ${value('email')}`, value('empresa') ? `Empresa/projeto: ${value('empresa')}` : '', '', `Gostaria de conversar sobre: ${value('necessidade')}`].filter(line => line !== undefined).join('\n');
    continuation.href = `https://wa.me/${form.dataset.whatsapp}?text=${encodeURIComponent(message)}`;
    continuation.hidden = false;
    status.textContent = 'Mensagem preparada. Continue no WhatsApp para revisar e enviar.';
    continuation.focus();
  });
  form?.addEventListener('input', () => {
    if (!continuation.hidden) {
      continuation.hidden = true;
      continuation.removeAttribute('href');
      status.textContent = 'Você alterou os dados. Prepare a solicitação novamente.';
    }
  });
})();
