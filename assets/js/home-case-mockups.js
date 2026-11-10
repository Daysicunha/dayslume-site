/* DAYSLUME — mockups reais dos cases da Home.
   Mantém a mídia atual como fallback até os novos arquivos estarem no deploy. */
(() => {
  const applyMockup = (host) => {
    const file = host.getAttribute('data-home-mockup');
    if (!file) return;
    const preload = new Image();
    preload.onload = () => {
      if (!preload.naturalWidth) return;
      const picture = host.querySelector('picture');
      const img = host.querySelector('img');
      if (!img) return;
      if (picture) picture.querySelectorAll('source').forEach((item) => item.remove());
      img.src = file;
      img.width = 1600;
      img.height = 900;
      img.decoding = 'async';
      img.alt = host.getAttribute('data-home-mockup-alt') || img.alt;
      host.classList.add('has-home-mockup');
    };
    preload.onerror = () => { /* preserva o layout atual se o arquivo não existir */ };
    preload.src = file;
  };
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelectorAll('[data-home-mockup]').forEach(applyMockup);
    }, { once: true });
  } else {
    document.querySelectorAll('[data-home-mockup]').forEach(applyMockup);
  }
})();
