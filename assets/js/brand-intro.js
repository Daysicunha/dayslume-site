/* DAYSLUME — assinatura animada 2026
   Abertura experimental opt-in via ?intro=1; no máximo uma vez por sessão.
   Preserva hero existente, respeita movimento reduzido e modo de economia. */
(() => {
  'use strict';

  const root = document.documentElement;
  if (!root.classList.contains('dl-intro-running')) return;

  const intro = document.getElementById('dayslume-brand-intro');
  const skip = intro?.querySelector('[data-intro-skip]');
  const name = intro?.querySelector('[data-intro-name]');
  const lineOne = intro?.querySelector('[data-intro-line-one]');
  const lineTwo = intro?.querySelector('[data-intro-line-two]');
  const petalImages = [...(intro?.querySelectorAll('.dl-intro__petal') || [])];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');

  let cancelled = false;
  let closing = false;
  const waits = new Set();
  const delay = (ms) => new Promise(resolve => {
    const token = setTimeout(() => { waits.delete(token);resolve(); },ms);
    waits.add(token);
  });
  function remember() {
    try { sessionStorage.setItem('dayslume-brand-intro-v2','played'); } catch (_) {}
  }
  function finish(instant = false) {
    if (closing) return;
    closing = true;
    cancelled = true;
    remember();
    clearTimeout(window.__dlIntroFailsafe);
    if (!instant) root.classList.add('dl-intro-finishing');
    const done = () => {
      root.classList.remove('dl-intro-running','dl-intro-finishing');
      if (intro) intro.hidden = true;
      if (document.activeElement === skip) {
        const heading = document.getElementById('hero-title');
        if (heading) {
          heading.tabIndex = -1;
          heading.focus({preventScroll:true});
          heading.addEventListener('blur',()=>heading.removeAttribute('tabindex'),{once:true});
        }
      }
    };
    if (instant) done();
    else setTimeout(done,660);
  }
  if (!intro || !skip || !name || !lineOne || !lineTwo || petalImages.length!==6 ||
      reduced.matches || Boolean(navigator.connection?.saveData)) {
    finish(true);
    return;
  }
  skip.addEventListener('click',()=>finish());
  addEventListener('keydown', event => {
    if (closing) return;
    if (event.key==='Escape') {event.preventDefault();finish();}
    if (event.key==='Tab') {event.preventDefault();skip.focus({preventScroll:true});}
  });
  reduced.addEventListener('change',()=>{ if (reduced.matches) finish(true); });
  addEventListener('pagehide',()=>finish(true),{once:true});

  async function typeInto(node, value, pace) {
    node.classList.add('dl-intro__cursor');
    for (const letter of Array.from(value)) {
      if (cancelled) return;
      node.textContent += letter;
      await delay(pace);
    }
    node.classList.remove('dl-intro__cursor');
  }
  async function play() {
    await delay(350); if(cancelled)return;
    intro.classList.add('is-dot');
    await delay(480); if(cancelled)return;
    intro.classList.add('is-writing');
    await delay(220); if(cancelled)return;
    await typeInto(name,'DAYSLUME',72); if(cancelled)return;
    await delay(150); if(cancelled)return;
    await typeInto(lineOne,'Ideias ganham forma.',42); if(cancelled)return;
    await delay(100); if(cancelled)return;
    await typeInto(lineTwo,'Experiências ganham vida.',38); if(cancelled)return;
    intro.classList.add('is-assembling');
    await delay(1310); if(cancelled)return;
    intro.classList.add('is-assembled');
    await delay(460); if(cancelled)return;
    finish();
  }
  play().catch(()=>finish(true));
})();
