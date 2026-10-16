const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const internal=read('assets/css/internal-home-parity.css');
const home=read('assets/css/home-section-rhythm.css');
const projects=read('assets/css/projects-experience.css');
const projectPage=read('projetos.html');
const index=read('index.html');
const finalQa=read('assets/css/final-qa-20261014.css');
const homeMockups=read('assets/js/home-case-mockups.js');
const interior=['servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html','sites-completos.html','landing-pages.html','vitrini.html','vitrini-link.html'];

test('header and footer share consistent, smaller DAYSLUME logo on eleven main pages',()=>{
 const pages=['index.html',...interior];
 for(const p of pages){
  const html=read(p);
  assert.equal((html.match(/<h1\b/g)||[]).length,1,p);
  assert.match(html,/logohorizontalbranca\.png/,p);
  assert.equal((html.match(/class="floating-whatsapp"/g)||[]).length,1,p);
 }
 assert.match(internal,/brand-lockup\s*\{\s*width:clamp\(145px,10\.45vw,176px\)/);
 assert.match(internal,/footer-identity \.brand-lockup\s*\{\s*width:clamp\(165px,16vw,207px\)/);
 assert.match(home,/site-header \.brand-logo-img/);
 assert.match(home,/site-footer \.footer-main \.footer-logo-img/);
 assert.match(internal,/grid-template-columns:minmax\(210px,1fr\) minmax\(0,1\.25fr\) minmax\(145px,\.55fr\)/);
});

test('compact floating WhatsApp keeps a 44px minimum target with keyboard and touch controls',()=>{
 for(const css of [internal,home]){
  assert.match(css,/floating-whatsapp[^{}]*\{[\s\S]*?width:46px/);
  assert.match(css,/floating-whatsapp svg\s*\{width:20px;height:20px\}/);
  assert.match(css,/safe-area-inset-bottom/);
 }
 for(const p of interior){
  const html=read(p);
  assert.match(html,/aria-label="Falar com a DAYSLUME pelo WhatsApp"/,p);
  assert.match(html,/https:\/\/wa\.me\/5531994492474/,p);
 }
});

test('the three product/case/about heroes do not inherit oversized header padding',()=>{
 assert.match(internal,/hero:is\(\.products-hero,\.projects-hero,\.about-hero\)/);
 assert.match(internal,/padding:clamp\(132px,9\.3vw,151px\)/);
 assert.match(internal,/font-size:clamp\(42px,4\.2vw,62px\)/);
 assert.match(internal,/padding:124px 0 54px/);
 assert.match(internal,/content:none;display:none;/);
});

test('project mockups use actual images and transparent illustrative placeholders',()=>{
 assert.match(projectPage,/src="assets\/images\/tornearia-barbosa-case\.webp"/);
 assert.match(projectPage,/src="assets\/images\/new-rocket-play-home\.webp"/);
 assert.match(projectPage,/id="dayane-nails"/);
 assert.match(projectPage,/id="loh-gourmet"/);
 assert.match(projectPage,/herodayane\.webp/);
 assert.match(projectPage,/hero-loh-gourmet\.avif/);
 assert.match(projects,/case-featured>\.case-media img\{/);
 assert.match(projects,/object-fit:contain/);
 assert.match(projects,/execution-proof__items>a:first-child\{/);
 assert.match(projects,/background:#202532/);
 assert.match(projects,/@media\(max-width:540px\)/);
});

test('home uses the three approved 16:9 mockups with centered responsive framing',()=>{
 for(const file of ['case-tornearia-barbosa-1600x900.webp','case-new-rocket-play-1600x900.webp','case-engreni-agenda-1600x900.webp']){
  assert.match(index,new RegExp(`data-home-mockup="assets/images/${file}"`));
  assert.ok(fs.existsSync(path.join(root,'assets/images',file)),file);
 }
 assert.match(index,/class="solution-graphic product-interface engreni-graphic"[^>]*data-home-mockup="assets\/images\/case-engreni-agenda-1600x900\.webp"/);
 assert.doesNotMatch(index,/class="project-image case-preview--dayane"[^>]*data-home-mockup=/);
 assert.match(homeMockups,/naturalWidth/);
 assert.match(homeMockups,/classList\.contains\('engreni-graphic'\)/);
 assert.match(homeMockups,/classList\.add\('has-home-mockup'\)/);
 assert.match(finalQa,/flagship-cases \.project-image\.has-home-mockup\s*\{[\s\S]*?aspect-ratio:\s*16 \/ 9/);
 assert.match(finalQa,/solution-engreni \.engreni-graphic\.has-home-mockup\s*\{[\s\S]*?aspect-ratio:\s*16 \/ 9/);
 assert.match(finalQa,/engreni-agenda-case-image\s*\{[\s\S]*?object-position:\s*center/);
});

test('shared style loads ahead of official palette, preserving canonical brand tokens',()=>{
 for(const p of interior){
  const html=read(p);
  const links=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
  assert.ok(links.includes('assets/css/internal-home-parity.css'),p);
  assert.equal(links.at(-1),'assets/css/brand-palette.css',p);
 }
 const links=[...index.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
 assert.equal(links.at(-1),'assets/css/brand-palette.css');
});
