const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=file=>fs.readFileSync(path.join(__dirname,'..',file),'utf8');
const home=read('index.html');
const css=read('assets/css/cinematic-editorial-33.css');
const motion=read('assets/js/cases-showroom-motion.js');
const nativeScroll=read('assets/js/hero-prism-scroll.js');
const section=home.slice(home.indexOf('id="projetos"'),home.indexOf('id="sobre"'));
const patch=css.split('17/11/2026 — ATO V / cases compactos, layout da imagem aprovada.')[1] || '';

test('Ato V retains all three real cases, their image assets and external links',()=>{
  assert.ok(section.includes('cases-reference-compact') || home.includes('cases-reference-compact'));
  assert.equal((section.match(/class="project-card flagship-case/g)||[]).length,3);
  for(const title of ['Tornearia Barbosa','New Rocket Play','Dayane Cunha Nails']) assert.ok(section.includes(title),title);
  for(const file of ['tornearia-barbosa-case.webp','new-rocket-play-home.webp','case-engreni-agenda-1600x900.webp']) assert.ok(section.includes(file),file);
  for(const link of ['https://tornearia-barbosa.vercel.app/','https://new-rocket-play.vercel.app/','https://dayane-cunha-nails.vercel.app/']) assert.ok(section.includes(link),link);
  assert.match(section,/class="projects-portfolio-cta"/);
  assert.match(section,/class="execution-proof"/);
  assert.match(section,/class="case-conversion"/);
});

test('Ato V structures nine accessible, concise problem/response/delivery lines',()=>{
  assert.equal((section.match(/class="case-step-icon"/g)||[]).length,9);
  assert.equal((section.match(/class="case-step-description"/g)||[]).length,9);
  for(const term of ['DESAFIO','PROBLEMA','RESPOSTA','ENTREGA','VALOR']) assert.ok(section.includes('case-step-label">'+term+'</span>'),term);
  assert.match(section,/aria-hidden="true" focusable="false"/);
  assert.match(section,/class="cases-neon-waves"/);
  assert.match(section,/aria-label="Prova de execução da DAYSLUME"/);
});

test('Ato V uses dark reference composition and compact three-card desktop grid',()=>{
  assert.ok(patch);
  assert.match(patch,/section#projetos\.section/);
  assert.match(patch,/grid-template-columns:repeat\(3,minmax\(0,1fr\)\)/);
  assert.match(patch,/aspect-ratio:2\.13/);
  assert.match(patch,/\.projects-grid--launch \.case-story \.case-step/);
  assert.match(patch,/\.case-dayane-snapshot/);
  assert.match(patch,/\.cases-neon-waves/);
  assert.match(patch,/\.execution-proof/);
  assert.match(patch,/@media \(max-width:900px\)/);
  assert.match(patch,/@media \(max-width:480px\)/);
  assert.match(patch,/@media \(prefers-reduced-motion:reduce\)/);
  assert.doesNotMatch(patch,/#apresentacao|#cinema33-film|\.hero--floating-panels/);
  assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
});

test('Ato V preserves one-shot existing case reveals, pauses ambient animation and avoids hidden links',()=>{
  assert.match(nativeScroll,/\['\.flagship-case','case'\]/);
  assert.match(home,/src="assets\/js\/cases-showroom-motion\.js" defer/);
  assert.match(motion,/IntersectionObserver/);
  assert.match(motion,/cases-is-visible/);
  assert.match(motion,/prefers-reduced-motion: reduce/);
  assert.match(motion,/navigator\.connection/);
  assert.match(motion,/document\.hidden/);
  assert.doesNotMatch(motion,/requestAnimationFrame|setTimeout|setInterval/);
  assert.match(patch,/@keyframes cases-wave-glisten/);
  assert.doesNotMatch(patch,/display:none!important;[\s\S]{0,100}\.flagship-case/);
});
