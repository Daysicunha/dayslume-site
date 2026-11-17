const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const read = file => fs.readFileSync(path.resolve(__dirname, '..', file), 'utf8');
const home = read('index.html');
const css = read('assets/css/contents-cinematic-33.css');
const motion = read('assets/js/contents-cinematic-motion.js');
const nativeScroll = read('assets/js/hero-prism-scroll.js');
const start = home.indexOf('id="conteudos"');
const end = home.indexOf('id="contato"', start);
const section = home.slice(start, end);

test('Ato VII: conserva os dois artigos e links existentes da home', () => {
  assert.ok(start > 0 && end > start);
  assert.equal((section.match(/<article class="content-featured">/g) || []).length, 1);
  assert.equal((section.match(/<article class="content-secondary">/g) || []).length, 1);
  for (const title of [
    'Presença digital estratégica: como organizar seus canais',
    'Um site bonito também precisa funcionar.'
  ]) assert.ok(section.includes(title), title);
  for (const href of [
    'blog/presenca-digital-estrategica.html',
    'blog/site-bonito-precisa-funcionar.html',
    'blog.html'
  ]) assert.ok(section.includes('href="' + href + '"'), href);
  assert.match(section, /EDIÇÃO 01 \/ 2026/);
  assert.match(section, /Duas leituras sobre presença digital e experiências que funcionam\./);
  assert.equal((section.match(/05 min/g) || []).length, 2);
});

test('Ato VII: ilustrações explicam a copy sem depender de imagens genéricas', () => {
  assert.match(section, /class="content-channels-stage"/);
  assert.equal((section.match(/class="channel-device channel-device--/g) || []).length, 3);
  assert.equal((section.match(/class="channel-callout channel-callout--/g) || []).length, 3);
  for (const term of [
    'Descoberta e', 'visibilidade', 'Informações e', 'confiança',
    'Conversa e', 'atendimento', 'ESTRATÉGIA \/ IDENTIDADE \/ DIREÇÃO'
  ]) assert.ok(section.includes(term.replaceAll('\\/', '/')), term);
  assert.match(section, /class="content-secondary__media content-compare-stage" aria-hidden="true"/);
  assert.equal((section.match(/class="compare-panel compare-panel--/g) || []).length, 2);
  assert.match(section, /ANTES \/ ATRITO/);
  assert.match(section, /DEPOIS \/ CLAREZA/);
  assert.match(section, /Hierarquia clara/);
  assert.match(section, /Caminho confuso/);
  assert.match(section, /class="contents-neon-waves"/);
  assert.match(section, /aria-label="Ler artigo: Um site bonito também precisa funcionar"/);
});

test('Ato VII: estilos compactos, isolados e com adaptação mobile', () => {
  assert.match(home, /class="section migrated-blog content-magazine contents-cinematic /);
  assert.match(css, /section#conteudos\.contents-cinematic/);
  assert.match(css, /grid-template-columns:minmax\(0,38%\) minmax\(0,62%\)/);
  assert.match(css, /\.channels-orbit/);
  assert.match(css, /\.compare-panel--after/);
  assert.match(css, /\.content-insights\.content-insights--compact/);
  assert.match(css, /@media \(max-width:800px\)/);
  assert.match(css, /@media \(max-width:540px\)/);
  assert.match(css, /@media \(max-width:355px\)/);
  assert.match(css, /@media \(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(css, /#apresentacao|#cinema33-film|\.hero--floating-panels/);
  assert.equal((css.match(/\{/g) || []).length, (css.match(/\}/g) || []).length);
  const cssOrder = [...home.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m => m[1]);
  assert.equal(cssOrder.at(-1), 'assets/css/brand-palette.css');
  assert.ok(cssOrder.includes('assets/css/contents-cinematic-33.css'));
});

test('Ato VII: animação de scroll existente mais efeitos contextuais sem loops JS', () => {
  assert.match(nativeScroll, /\['\.content-featured','feature'\]/);
  assert.match(nativeScroll, /\['\.content-secondary','article'\]/);
  assert.match(home, /src="assets\/js\/contents-cinematic-motion\.js" defer/);
  assert.match(motion, /IntersectionObserver/);
  assert.match(motion, /contents-is-visible/);
  assert.match(motion, /observer\.observe\(section\)/);
  assert.match(motion, /prefers-reduced-motion: reduce/);
  assert.match(motion, /navigator\.connection/);
  assert.match(motion, /document\.hidden/);
  assert.doesNotMatch(motion, /requestAnimationFrame|setInterval|setTimeout/);
  for (const key of [
    'contents-channel-instagram',
    'contents-channel-site',
    'contents-channel-whatsapp',
    'contents-connection-pulse',
    'contents-after-glow',
    'contents-compare-arrow',
    'contents-wave-shine'
  ]) assert.ok(css.includes('@keyframes ' + key), key);
});
