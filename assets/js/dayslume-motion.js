/* A shared preference for motion across the institutional pages. */
(() => {
  'use strict';
  const root = document.documentElement;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const terms = [...document.querySelectorAll('.rotating-term')];
  const videos = [...document.querySelectorAll('[data-motion-video]')];
  let timer;
  let index = 0;
  const sync = () => {
    clearInterval(timer);
    const stopped = reduced.matches || document.hidden;
    root.classList.toggle('motion-paused', stopped);
    videos.forEach(video => {
      if (stopped || video.dataset.motionVideo === 'scrub') video.pause();
      else video.play().catch(() => {});
    });
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

/* The hero film is explored by pointer movement on desktop and scroll on touch screens. */
(() => {
  'use strict';
  const root = document.documentElement;
  const video = document.querySelector('[data-motion-video="scrub"]');
  const hero = video?.closest('.hero');
  if (!video || !hero) return;

  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  let duration = 0;
  let targetTime = 0;
  let frame = 0;

  const clamp = value => Math.max(0, Math.min(1, value));
  const canScrub = () => duration > 0 && !document.hidden && !root.classList.contains('motion-paused');
  const render = () => {
    frame = 0;
    if (!canScrub()) return;
    const time = Math.min(Math.max(targetTime, 0), Math.max(duration - 0.04, 0));
    if (Math.abs(video.currentTime - time) > 0.012) video.currentTime = time;
  };
  const seekTo = progress => {
    if (!duration) return;
    targetTime = clamp(progress) * duration;
    if (!frame) frame = requestAnimationFrame(render);
  };
  const seekFromPointer = event => {
    if (!finePointer.matches || !canScrub()) return;
    const rect = hero.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    const horizontal = clamp((event.clientX - rect.left) / rect.width);
    const vertical = clamp((event.clientY - rect.top) / rect.height);
    seekTo((horizontal * .9) + (vertical * .1));
  };
  const seekFromScroll = () => {
    if (finePointer.matches && innerWidth > 800) return;
    const rect = hero.getBoundingClientRect();
    const range = Math.max(rect.height * .82, 1);
    seekTo(clamp(-rect.top / range));
  };
  const ready = () => {
    duration = Number.isFinite(video.duration) ? video.duration : 0;
    video.pause();
    if (finePointer.matches && innerWidth > 800) seekTo(.04);
    else seekFromScroll();
  };

  if (video.readyState >= 1) ready();
  else video.addEventListener('loadedmetadata', ready, { once: true });

  hero.addEventListener('pointermove', seekFromPointer, { passive: true });
  addEventListener('scroll', seekFromScroll, { passive: true });
  addEventListener('resize', seekFromScroll, { passive: true });
  document.addEventListener('dayslume:motion', () => {
    video.pause();
    if (!finePointer.matches || innerWidth <= 800) seekFromScroll();
  });

  /* A first touch unlocks seeking on mobile Safari without leaving the film playing. */
  hero.addEventListener('pointerdown', () => {
    if (finePointer.matches || root.classList.contains('motion-paused')) return;
    const time = video.currentTime;
    const attempt = video.play();
    if (attempt) attempt.then(() => {
      video.pause();
      video.currentTime = time;
    }).catch(() => {});
  }, { once: true, passive: true });
})();
