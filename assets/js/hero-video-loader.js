(() => {
  const video = document.querySelector('.hero__bg-video');
  if (!video) return;

  const source = video.querySelector('source[data-src]');
  if (!source) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const saveData = Boolean(connection && connection.saveData);
  const compactViewport = window.matchMedia('(max-width: 720px)').matches;

  if (reduceMotion || saveData || compactViewport) {
    video.removeAttribute('autoplay');
    video.setAttribute('aria-hidden', 'true');
    return;
  }

  source.src = source.dataset.src;
  video.load();

  const play = () => {
    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') attempt.catch(() => {});
  };

  if ('requestIdleCallback' in window) {
    requestIdleCallback(play, { timeout: 900 });
  } else {
    window.setTimeout(play, 180);
  }
})();