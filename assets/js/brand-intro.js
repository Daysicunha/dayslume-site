/* DAYSLUME | Brand intro 2.0 — abertura cinematográfica sem dependências.
   Ponto > digitação > frase editorial > seis pétalas oficiais > Hero (FLIP).
   Preview: ?intro=1 força replay; visitas normais tocam uma vez por sessão. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('dl-intro-running')) return;

  const intro = document.getElementById('dayslume-brand-intro');
  const skip = intro?.querySelector('[data-intro-skip]');
  const name = intro?.querySelector('[data-intro-name]');
  const lineOne = intro?.querySelector('[data-intro-line-one]');
  const lineTwo = intro?.querySelector('[data-intro-line-two]');
  const flower = intro?.querySelector('.dl-intro__flower');
  const petals = [...(intro?.querySelectorAll('.dl-intro__petal') || [])];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);

  let cancelled = false;
  let closing = false;
  const pause = ms => new Promise(resolve => setTimeout(resolve,ms));
  const remember = () => {
    try { sessionStorage.setItem('dayslume-brand-intro-v3','played'); } catch (_) {}
  };
  function release(focusAfter = false) {
    clearTimeout(window.__dlIntroFailsafe);
    root.classList.remove('dl-intro-running','dl-intro-finishing');
    if (intro) intro.hidden = true;
    if (focusAfter) {
      const h1 = document.getElementById('hero-title');
      if (h1) {
        h1.tabIndex = -1;
        h1.focus({preventScroll:true});
        h1.addEventListener('blur',()=>h1.removeAttribute('tabindex'),{once:true});
      }
    }
  }
  function close({instant=false,focusAfter=false}={}) {
    if (closing) return;
    cancelled = true;
    closing = true;
    remember();
    if (instant) return release(focusAfter);
    root.classList.add('dl-intro-finishing');
    setTimeout(()=>release(focusAfter),410);
  }

  if (!intro || !skip || !name || !lineOne || !lineTwo || !flower ||
      petals.length!==6 || reduced.matches || saveData) {
    close({instant:true});
    return;
  }

  skip.addEventListener('click',()=>close({focusAfter:true}));
  const onKeyDown = event => {
    if (closing) return;
    if (event.key === 'Escape') {
      event.preventDefault();
      close({focusAfter:true});
    } else if (event.key === 'Tab') {
      // A única ação do overlay é pular a abertura.
      event.preventDefault();
      skip.focus({preventScroll:true});
    }
  };
  addEventListener('keydown',onKeyDown);
  const onReduced = () => {if(reduced.matches)close({instant:true});};
  reduced.addEventListener('change',onReduced);
  addEventListener('pagehide',()=>close({instant:true}),{once:true});

  async function typeInto(node,phrase,pace) {
    node.textContent = '';
    node.classList.add('dl-intro__cursor');
    for(const letter of Array.from(phrase)) {
      if(cancelled)return;
      node.textContent += letter;
      await pause(pace);
    }
    node.classList.remove('dl-intro__cursor');
  }

  function morphToHero() {
    if(cancelled) return false;
    const target = document.querySelector('.hero--interactive-flower .hero-visual-composition .flower-scene');
    // A flor de destino já é o conjunto oficial das mesmas seis pétalas PNG.
    if (!target) return false;
    const sourceRect = flower.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    if (!sourceRect.width || !targetRect.width || !isFinite(targetRect.left))return false;
    const isVisible = targetRect.top < innerHeight * .85 && targetRect.bottom > innerHeight * .12;
    const scale = targetRect.width / sourceRect.width;
    if (!isVisible || scale < .5 || scale > 4.5) return false;
    const x = (targetRect.left+targetRect.width/2)-(sourceRect.left+sourceRect.width/2);
    const y = (targetRect.top+targetRect.height/2)-(sourceRect.top+sourceRect.height/2);
    flower.style.setProperty('--dl-target-x',x.toFixed(2)+'px');
    flower.style.setProperty('--dl-target-y',y.toFixed(2)+'px');
    flower.style.setProperty('--dl-target-scale',scale.toFixed(5));
    return true;
  }

  async function play() {
    await pause(180); if(cancelled)return;
    intro.classList.add('is-dot');
    await pause(300); if(cancelled)return;
    intro.classList.add('is-writing');
    await pause(120); if(cancelled)return;
    await typeInto(name,'DAYSLUME',64); if(cancelled)return;
    await pause(90); if(cancelled)return;
    await typeInto(lineOne,'Ideias ganham forma.',30); if(cancelled)return;
    await pause(80); if(cancelled)return;
    lineTwo.textContent = 'Experiências ganham vida.';
    intro.classList.add('is-second-line');
    await pause(320); if(cancelled)return;
    intro.classList.add('is-assembling');
    // Última pétala termina após 550ms de escalonamento + 520ms de encaixe.
    await pause(1080); if(cancelled)return;
    intro.classList.add('is-assembled');
    await pause(80); if(cancelled)return;
    if(!morphToHero()) intro.classList.add('is-morph-fallback');
    intro.classList.add('is-morphing');
    await pause(860); if(cancelled)return;
    // O overlay entrega a flor à Hero no mesmo quadro visual.
    cancelled = true;
    closing = true;
    remember();
    release(false);
  }
  play().catch(()=>close({instant:true}));
})();
