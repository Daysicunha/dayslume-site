/* A shared preference for motion across the institutional pages. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const terms = [...document.querySelectorAll('.rotating-term')];
  let timer;
  let index = 0;
  const sync = () => {
    clearInterval(timer);
    const stopped = reduced.matches || document.hidden;
    root.classList.toggle('motion-paused', stopped);
    document.dispatchEvent(new Event('dayslume:motion'));
    if (!stopped && terms.length > 1) timer = setInterval(() => {
      terms[index].classList.remove('is-current');
      index = (index + 1) % terms.length;
      terms[index].classList.add('is-current');
    }, 3400);
  };
  reduced.addEventListener('change', sync);
  document.addEventListener('visibilitychange', sync);
  root.classList.add('days-motion-ready');
  sync();
})();

/* Keep the persistent contact shortcut away from contact areas and foreground
   actions. This runs on every page because dayslume-motion.js is shared. */
(() => {
  'use strict';

  const init = () => {
    const action = document.querySelector('.floating-whatsapp');
    if (!action) return;

    const contextTargets = [...document.querySelectorAll(
      '#contato, #solicitar, .contact-form, main > .band:last-child, .site-footer, .footer'
    )];
    const overlapTargets = [...document.querySelectorAll(
      'main a.btn, main button.btn, .contact-note a, .projects-portfolio-cta, .content-archive'
    )];
    const initialTabindex = action.getAttribute('tabindex');
    let frame = 0;

    const overlaps = (left, right) => (
      left.bottom > right.top + 6 &&
      left.top < right.bottom - 6 &&
      left.right > right.left + 6 &&
      left.left < right.right - 6
    );

    const setHidden = hidden => {
      action.classList.toggle('is-context-hidden', hidden);
      action.classList.toggle('days-overlaps-hero', hidden);
      if (hidden && document.activeElement !== action) {
        action.setAttribute('aria-hidden', 'true');
        action.tabIndex = -1;
      } else {
        action.removeAttribute('aria-hidden');
        if (initialTabindex === null) action.removeAttribute('tabindex');
        else action.setAttribute('tabindex', initialTabindex);
      }
    };

    const update = () => {
      frame = 0;
      const actionBounds = action.getBoundingClientRect();
      const nearContactContext = contextTargets.some(target => {
        const bounds = target.getBoundingClientRect();
        return bounds.top < innerHeight - 24 && bounds.bottom > actionBounds.top;
      });
      const coveringAction = overlapTargets.some(target => overlaps(
        target.getBoundingClientRect(), actionBounds
      ));
      setHidden((nearContactContext || coveringAction) && document.activeElement !== action);
    };

    const requestUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    addEventListener('scroll', requestUpdate, { passive: true });
    addEventListener('resize', requestUpdate, { passive: true });
    addEventListener('orientationchange', requestUpdate, { passive: true });
    action.addEventListener('blur', requestUpdate);
    requestUpdate();
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
