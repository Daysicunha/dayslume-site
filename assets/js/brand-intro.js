/* DAYSLUME — Intro 3.0 | ponto→cursor→palavras→seis pétalas→Hero.
 * Progressive enhancement, replay via ?intro=1, once per tab/session otherwise.
 * Works without an animation library; never changes the real Hero layout. */
(() => {
  'use strict';
  const root = document.documentElement;
  if (!root.classList.contains('dl-intro-running')) return;

  const intro = document.getElementById('dayslume-brand-intro');
  const stage = intro?.querySelector('.dl-intro__stage');
  const skip = intro?.querySelector('[data-intro-skip]');
  const point = intro?.querySelector('.dl-intro__point');
  const name = intro?.querySelector('[data-intro-name]');
  const lineOne = intro?.querySelector('[data-intro-line-one]');
  const lineTwo = intro?.querySelector('[data-intro-line-two]');
  const flower = intro?.querySelector('.dl-intro__flower');
  const petals = [...(intro?.querySelectorAll('.dl-intro__petal') ?? [])];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const saveData = Boolean(navigator.connection?.saveData);
  let cancelled = false;
  let closing = false;
  let focusOnRelease = false;
  const wait = duration => new Promise(resolve => setTimeout(resolve, duration));
  const remember = () => {
    try { sessionStorage.setItem('dayslume-brand-intro-v4', 'played'); } catch (_) {}
  };

  function release(focus = false) {
    clearTimeout(window.__dlIntroFailsafe);
    root.classList.remove('dl-intro-running','dl-intro-finishing','dl-intro-handoff','dl-intro-landed');
    if (intro) intro.hidden = true;
    if (focus) {
      const heading = document.getElementById('hero-title');
      if (heading) {
        heading.tabIndex = -1;
        heading.focus({preventScroll:true});
        heading.addEventListener('blur',()=>heading.removeAttribute('tabindex'),{once:true});
      }
    }
  }
  function close({instant=false,focus=false}={}) {
    if (closing) return;
    closing = true;
    cancelled = true;
    focusOnRelease ||= focus;
    remember();
    if (instant) { release(focusOnRelease); return; }
    root.classList.add('dl-intro-finishing','dl-intro-handoff');
    setTimeout(()=>release(focusOnRelease),420);
  }
  if (!intro || !stage || !skip || !point || !name || !lineOne ||
      !lineTwo || !flower || petals.length!==6 || reduced.matches || saveData) {
    close({instant:true});
    return;
  }

  skip.addEventListener('click',()=>close({focus:true}));
  const onKeyDown = event => {
    if (closing) return;
    if (event.key==='Escape') {
      event.preventDefault();
      close({focus:true});
    } else if (event.key==='Tab') {
      // Não deixa o foco sair para links ocultos sob o overlay.
      event.preventDefault();
      skip.focus({preventScroll:true});
    }
  };
  addEventListener('keydown',onKeyDown);
  reduced.addEventListener('change',()=>{if(reduced.matches)close({instant:true});});
  addEventListener('pagehide',()=>close({instant:true}),{once:true});

  const caretPosition = () => {
    const a = stage.getBoundingClientRect();
    const b = name.getBoundingClientRect();
    const x = Math.max(0, Math.min(a.width, b.right-a.left));
    const y = Math.max(0, Math.min(a.height, b.top+b.height*.52-a.top));
    intro.style.setProperty('--dl-caret-x', x.toFixed(1)+'px');
    intro.style.setProperty('--dl-caret-y', y.toFixed(1)+'px');
  };
  async function typeBrand() {
    name.textContent='';
    caretPosition();
    intro.classList.add('is-writing');
    await wait(280);
    if(cancelled) return;
    for(const char of Array.from('DAYSLUME')) {
      if(cancelled) return;
      name.textContent+=char;
      caretPosition();
      await wait(54);
    }
    intro.classList.add('is-name-complete');
  }

  async function showWords(textValue) {
    lineOne.textContent='';
    const words = textValue.split(' ');
    for(let index=0; index<words.length; index++) {
      if(cancelled)return;
      const span = document.createElement('span');
      span.className='dl-intro__word';
      span.textContent=words[index]+(index<words.length-1 ? ' ' : '');
      lineOne.appendChild(span);
      // Two frames guarantee transition from the hidden initial state.
      await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
      span.classList.add('is-revealed');
      await wait(135);
    }
  }
  function measureHeroTarget() {
    const target = document.querySelector('.hero--interactive-flower .hero-visual-composition .flower-scene');
    if (!target || innerHeight<375) return false;
    const sourceRect=flower.getBoundingClientRect();
    const targetRect=target.getBoundingClientRect();
    if (sourceRect.width===0 || targetRect.width===0 || !Number.isFinite(targetRect.left)) return false;
    const visible = innerWidth<=800
      ? targetRect.top>=0 && targetRect.top<innerHeight*.78 &&
        targetRect.left>=-10 && targetRect.right<=innerWidth+10
      : targetRect.top>=0 && targetRect.bottom<=innerHeight*1.08;
    const scale=targetRect.width/sourceRect.width;
    if (!visible || scale<.55 || scale>4.5) return false;
    const dx=(targetRect.left+targetRect.width/2)-(sourceRect.left+sourceRect.width/2);
    const dy=(targetRect.top+targetRect.height/2)-(sourceRect.top+sourceRect.height/2);
    flower.style.setProperty('--dl-target-x',dx.toFixed(2)+'px');
    flower.style.setProperty('--dl-target-y',dy.toFixed(2)+'px');
    flower.style.setProperty('--dl-target-scale',scale.toFixed(5));
    return true;
  }

  async function play() {
    await wait(170); if(cancelled)return;
    intro.classList.add('is-dot');
    await wait(320); if(cancelled)return;
    await typeBrand(); if(cancelled)return;
    await wait(60); if(cancelled)return;
    await showWords('Ideias ganham forma.'); if(cancelled)return;
    await wait(40); if(cancelled)return;
    lineTwo.textContent='Experiências ganham vida.';
    intro.classList.add('is-second-line');
    await wait(230); if(cancelled)return;
    intro.classList.add('is-assembling');
    // 500ms escalonamento + 510ms de encaixe + 90ms para estabilizar.
    await wait(1100); if(cancelled)return;
    intro.classList.add('is-assembled');
    await wait(165); if(cancelled)return;
    if(!measureHeroTarget()) intro.classList.add('is-morph-fallback');
    root.classList.add('dl-intro-handoff');
    intro.classList.add('is-morphing');
    await wait(710); if(cancelled)return;
    // When both official six-petal scenes overlap, crossfade only at the landing.
    root.classList.add('dl-intro-landed');
    await wait(110); if(cancelled)return;
    closing=true;
    cancelled=true;
    remember();
    release(false);
  }
  play().catch(()=>close({instant:true}));
})();
