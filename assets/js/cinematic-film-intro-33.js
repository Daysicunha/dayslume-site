/* DAYSLUME 3.3 — actual Claude-inspired film opening.
   Scroll storyboard: ABERTURA -> NECESSIDADE -> PRESENÇA -> OPERAÇÃO -> CONTATO.
   Six fragments assemble into one interface and then split into VITRINI / ENGRENI. */
(() => {
  'use strict';
  const film = document.getElementById('cinema33-film');
  if (!film) return;
  const pin = film.querySelector('.c33-pin');
  const windowEl = film.querySelector('[data-c33-window]');
  const beam = film.querySelector('[data-c33-beam]');
  const glow = film.querySelector('[data-c33-glow]');
  const title = film.querySelector('[data-c33-title]');
  const hint = film.querySelector('[data-c33-hint]');
  const labels = [film.querySelector('[data-c33-vitrini]'), film.querySelector('[data-c33-engreni]')];
  const lines = [...film.querySelectorAll('[data-c33-caption]')];
  const scene = film.querySelector('[data-c33-scene]');
  const time = film.querySelector('[data-c33-time]');
  const header = document.querySelector('.site-header');
  const helpStrip = document.querySelector('.days-help-strip');
  const floatingWhatsApp = document.querySelector('.floating-whatsapp');
  if (!windowEl || !beam || !glow || !title || lines.length !== 5 || labels.some(label => !label)) return;
  const names = ['ABERTURA', 'NECESSIDADE', 'PRESENÇA', 'OPERAÇÃO', 'CONTATO'];
  // Source storyboard parameters: assembled rect (x,y,w,h),
  // split rect, dispersed x,y, initial rotation/scale, side.
  const D = [
    [0,0,1,.1,0,0,.48,.1,-.7,-.6,-18,.8,'left'],
    [0,.14,.62,.46,0,.14,.48,.5,-.2,-.9,12,1.1,'left'],
    [.66,.14,.34,.46,.52,0,.48,.1,.9,-.5,22,.9,'right'],
    [0,.64,.32,.36,0,.68,.48,.32,-.9,.5,-25,.85,'left'],
    [.34,.64,.32,.36,.52,.14,.48,.5,.1,.9,8,1.2,'right'],
    [.68,.64,.32,.36,.52,.68,.48,.32,.8,.6,16,.75,'right']
  ];
  const shapes = D.map(d => {
    const e = document.createElement('span');
    e.className = 'c33-shape c33-shape--' + d[12];
    windowEl.appendChild(e);
    return e;
  });
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const precisePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const saveData = Boolean(navigator.connection?.saveData);
  const clamp = n => Math.max(0, Math.min(1,n));
  const ease = n => { const t = clamp(n); return t*t*(3-2*t); };
  const lerp = (a,b,p) => a+(b-a)*p;
  let W = 0, H = 0, mx = 50, my = 50, active = false, raf = 0;
  let lastScene = -1, lastProgress = -1, lastMx = NaN, lastMy = NaN;
  const updateSize = () => {
    const vw = window.innerWidth, vh = window.innerHeight;
    const portrait = vw < vh;
    W = portrait ? vw*.86 : Math.min(vw*.62, vh*1.15);
    H = portrait ? W*.95 : W*.58;
    windowEl.style.width = W+'px';
    windowEl.style.height = H+'px';
    labels[0].style.left = W*.03+'px';
    labels[0].style.top = H*.30+'px';
    labels[1].style.left = W*.55+'px';
    labels[1].style.top = H*.30+'px';
  };
  /* One frame per meaningful event; no perpetual rAF loop while the film is idle.
     The drifting fragments still move smoothly as scroll progresses. */
  function draw(force = false) {
    if (reduce.matches) return;
    const rect = film.getBoundingClientRect();
    const p = clamp(-rect.top / Math.max(1, film.offsetHeight - pin.offsetHeight));
    if (force || Math.abs(p - lastProgress) > .00015) {
      const a = ease((p-.27)/.17);
      const b = ease((p-.57)/.15);
      const visible = ease((p-.07)/.10) * (1 - ease((p-.9)/.07)*.85);
      shapes.forEach((e,i) => {
        const d = D[i];
        const scatterX=d[8]*W*.5, scatterY=d[9]*H*.8;
        const float = Math.sin(p*12+i*1.7)*8*(1-a);
        const mergedX=(d[0]+d[2]/2-.5)*W;
        const mergedY=(d[1]+d[3]/2-.5)*H;
        const splitX=(d[4]+d[6]/2-.5)*W;
        const splitY=(d[5]+d[7]/2-.5)*H;
        const x=lerp(lerp(scatterX,mergedX,a),splitX,b);
        const y=lerp(lerp(scatterY,mergedY,a),splitY,b)+float;
        const rotation=d[10]*(1-a);
        const scale=lerp(d[11],1,a);
        const width=lerp(lerp(d[2]*W*.6,d[2]*W,a),d[6]*W,b);
        const height=lerp(lerp(d[3]*H*.6,d[3]*H,a),d[7]*H,b);
        e.style.width=width+'px';
        e.style.height=height+'px';
        e.style.opacity=visible.toFixed(3);
        e.style.transform='translate('+(x-width/2+W/2)+'px,'+(y-height/2+H/2)+'px) rotate('+rotation+'deg) scale('+scale+')';
      });
      beam.style.transform='translateX('+lerp(-70,70,p)+'vw) rotate('+lerp(22,-14,p)+'deg)';
      beam.style.opacity=(.55+.45*Math.sin(p*Math.PI)).toFixed(3);
      title.style.opacity=(1-ease(p/.1)).toFixed(3);
      title.style.transform='translateY('+(-p*160)+'px) scale('+(1+p*.4)+')';
      hint.style.opacity=p<.02?'1':'0';
      const current = p<.13 ? 0 : p<.33 ? 1 : p<.57 ? 2 : p<.84 ? 3 : 4;
      if (current !== lastScene) {
        lines.forEach((line,i) => {
          const show=i===current;
          line.classList.toggle('is-active',show);
          line.inert=!show;
        });
        scene.textContent='CENA '+(current+1)+' · '+names[current];
        lastScene=current;
      }
      const seconds=Math.round(p*102);
      const stamp='00:'+String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
      if (time.textContent !== stamp) time.textContent=stamp;
      film.classList.toggle('c33-reveal',b>.55);
      lastProgress = p;
    }
    if (force || mx !== lastMx || my !== lastMy) {
      glow.style.setProperty('--c33-mx',mx.toFixed(2)+'%');
      glow.style.setProperty('--c33-my',my.toFixed(2)+'%');
      lastMx=mx; lastMy=my;
    }
  }
  function paint() {
    raf = 0;
    if (document.hidden) return;
    setFilmChrome(isFilmInForeground());
    if (active && !reduce.matches && !document.documentElement.classList.contains('motion-paused')) {
      draw();
    }
  }
  function requestPaint() {
    if (!raf && !document.hidden) raf=requestAnimationFrame(paint);
  }
  function start() { if (active) requestPaint(); }
  function stop() {
    if (raf) cancelAnimationFrame(raf);
    raf=0;
  }
  function updateReduce() {
    stop();
    if (reduce.matches) {
      lines.forEach((line,i) => {
        line.inert=i!==0;
        line.classList.toggle('is-active',i===0);
      });
      scene.textContent='DAYSLUME · APRESENTAÇÃO';
      time.textContent='00:00:00';
      film.classList.remove('c33-reveal');
      title.style.removeProperty('opacity');
      title.style.removeProperty('transform');
    } else {
      lastScene=-1;
      lastProgress=-1;
      lastMx=NaN; lastMy=NaN;
      start();
    }
    requestPaint();
  }
  updateSize();
  lines.forEach((line,i) => { line.inert=i!==0; });
  if (reduce.matches) updateReduce();
  // Progressive enhancement: header is visible by default without JS.
  // The cinematic controller hides it only once every required listener exists.
  // The hand-off uses the viewport midpoint, not a 1px intersection at the end.
  let chromeState = null;
  function isFilmInForeground() {
    const rect = film.getBoundingClientRect();
    const midpoint = window.innerHeight * .5;
    return rect.top <= midpoint && rect.bottom > midpoint;
  }
  function setFilmChrome(isVisible) {
    if (chromeState === isVisible) return;
    chromeState = isVisible;
    document.body.classList.toggle('c33-intro-active', isVisible);
    if (header) {
      header.inert = isVisible;
      if (isVisible) {
        header.querySelector('.menu.open')?.classList.remove('open');
        const toggle = header.querySelector('.menu-toggle');
        if (toggle) {
          toggle.setAttribute('aria-expanded','false');
          toggle.setAttribute('aria-label','Abrir menu');
        }
      }
    }
    if (helpStrip) helpStrip.inert = isVisible;
    if (floatingWhatsApp) floatingWhatsApp.inert = isVisible;
  }
  const observer = new IntersectionObserver(entries => {
    active=entries[0].isIntersecting;
    if (active) start(); else stop();
    requestPaint();
  },{threshold:0});
  observer.observe(film);

  // Claude-style luminous separators at the beginning of each main section,
  // without replacing any existing layouts or section content.
  const cuts = [...document.querySelectorAll('body.home-page main > section:not(#cinema33-film)')];
  const cutObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-lit');
      cutObserver.unobserve(entry.target);
    });
  }, { threshold: .06 });
  cuts.forEach(section => {
    if (section.querySelector(':scope > .c33-section-line')) return;
    const line = document.createElement('span');
    line.className = 'c33-section-line';
    line.setAttribute('aria-hidden', 'true');
    // Absolute decoration appended at the end preserves :first-child layout rules.
    section.append(line);
    section.setAttribute('data-c33-seamed','');
    if (reduce.matches) line.classList.add('is-lit');
    else cutObserver.observe(line);
  });

  film.addEventListener('pointermove',event=>{
    if (!active || reduce.matches || saveData || !precisePointer.matches) return;
    mx=event.clientX/window.innerWidth*100;
    my=event.clientY/window.innerHeight*100;
    requestPaint();
  },{passive:true});
  film.addEventListener('pointerleave',()=>{
    mx=50; my=50;
    requestPaint();
  },{passive:true});
  window.addEventListener('resize',()=>{
    updateSize();
    lastProgress=-1; // geometry changed even if normalized scroll has not
    requestPaint();
  },{passive:true});
  window.addEventListener('scroll',requestPaint,{passive:true});
  window.addEventListener('hashchange',requestPaint);
  reduce.addEventListener('change',updateReduce);
  document.addEventListener('visibilitychange',()=>{if(document.hidden)stop();else requestPaint();});
  document.addEventListener('dayslume:motion',()=>{
    if(document.documentElement.classList.contains('motion-paused'))stop();
    else requestPaint();
  });
  setFilmChrome(isFilmInForeground());
  // Handled by one scroll-driven controller; never request a frame continuously.
  document.documentElement.classList.add('c33-film-ready');
  requestPaint();
})();
