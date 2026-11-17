const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const home=read('index.html');
const css=read('assets/css/cinematic-editorial-33.css');
const js=read('assets/js/founder-cinematic-motion.js');
const nativeMotion=read('assets/js/hero-prism-scroll.js');
const start=home.indexOf('id="sobre"');
const end=home.indexOf('id="conteudos"',start);
const section=home.slice(start,end);
const patch=css.split('17/11/2026 — ATO VI / fundadora em cena, referência cinematográfica aprovada.')[1] || '';

test('Ato VI: mantém foto real, liderança identificada, três etapas e destinos',()=>{
  assert.ok(start>0&&end>start);
  assert.equal((section.match(/daysi-cunha-editorial\.jpg/g)||[]).length,1);
  assert.match(section,/alt="Daysi Cunha, fundadora da DAYSLUME"/);
  assert.match(section,/class="founder-photo-signature"/);
  assert.match(section,/href="sobre\.html"/);
  assert.match(section,/href="processo\.html"/);
  assert.match(section,/A DAYSLUME é liderada por/);
  assert.match(section,/Um processo claro\./);
  assert.match(section,/Uma fundadora presente/);
  assert.match(section,/em cada decisão\./);
  for(const s of ['01 · Entender','02 · Construir','03 · Evoluir',
    'Ouvir o desafio e definir prioridades.',
    'Desenhar e desenvolver a solução necessária.',
    'Testar, entregar e orientar os próximos passos.'])assert.ok(section.includes(s),s);
  assert.equal((section.match(/class="about-process-icon"/g)||[]).length,3);
});

test('Ato VI: composição dark, título lilás e waves isoladas da Hero',()=>{
  assert.ok(patch);
  assert.match(patch,/section#sobre\.section/);
  assert.match(patch,/\.founder-neon-waves/);
  assert.match(patch,/\.founder-title-accent/);
  assert.match(patch,/\.founder-photo-signature/);
  assert.match(patch,/\.about-process-compact li/);
  assert.match(patch,/@media \(max-width:1020px\)/);
  assert.match(patch,/@media \(max-width:560px\)/);
  assert.match(patch,/@media \(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(patch,/#apresentacao|#cinema33-film|\.hero--floating-panels/);
  assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
  assert.match(section,/class="founder-neon-waves"/);
  assert.match(section,/aria-hidden="true" focusable="false"/);
});

test('Ato VI: animações sem loops JS e acessíveis sem JS',()=>{
  assert.match(home,/src="assets\/js\/founder-cinematic-motion\.js" defer/);
  assert.match(nativeMotion,/\['\.about-visual-card','portrait'\]/);
  assert.match(js,/IntersectionObserver/);
  assert.match(js,/founder-is-visible/);
  assert.match(js,/founder-has-entered/);
  assert.match(js,/observer\.observe\(section\)/);
  assert.match(js,/prefers-reduced-motion: reduce/);
  assert.match(js,/navigator\.connection/);
  assert.match(js,/document\.hidden/);
  assert.doesNotMatch(js,/requestAnimationFrame|setTimeout|setInterval/);
  assert.match(patch,/@keyframes founder-frame-breathe/);
  assert.match(patch,/@keyframes founder-wave-glisten/);
  assert.match(patch,/@keyframes founder-process-enter/);
  assert.doesNotMatch(patch,/opacity:\s*0\s*;\s*display:\s*none/);
  const cssFiles=[...home.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
  assert.equal(cssFiles.at(-1),'assets/css/brand-palette.css');
});
