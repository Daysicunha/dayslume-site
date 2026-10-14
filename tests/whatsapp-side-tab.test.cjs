const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const css=fs.readFileSync(path.join(root,'assets/css/brand-palette.css'),'utf8');
const pages=['index.html','servicos.html','solucoes.html','projetos.html','blog.html','sobre.html','contato.html','sites-completos.html','landing-pages.html','vitrini.html','vitrini-link.html','processo.html','projetos/tornearia-barbosa.html'];

test('final WhatsApp tab uses one vertically aligned brand icon and text',()=>{
 const latest=css.split('14/10 — FINALIZACAO DO RODAPE + ABA VERTICAL DO WHATSAPP')[1];
 assert.ok(latest,'missing final style pass');
 assert.match(latest,/right:clamp\(10px,1vw,18px\)/);
 assert.match(latest,/width:52px;/);
 assert.match(latest,/height:168px;/);
 assert.match(latest,/border-radius:20px;/);
 assert.match(latest,/content:"WhatsApp";[\s\S]*?order:1/);
 assert.match(latest,/writing-mode:vertical-rl/);
 assert.match(latest,/content:"";[\s\S]*?order:0/);
 assert.match(latest,/whatsapp-brand-mark\.svg/);
 assert.match(latest,/transform:rotate\(-90deg\)/);
 assert.match(latest,/right:10px;[\s\S]*?width:46px;[\s\S]*?height:142px;/);
 assert.match(latest,/safe-area-inset-bottom/);
 assert.match(latest,/focus-visible/);
 assert.match(latest,/prefers-reduced-motion:reduce/);
 const icon=fs.readFileSync(path.join(root,'assets/images/whatsapp-brand-mark.svg'),'utf8');
 assert.match(icon,/<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg"/);
 assert.match(icon,/viewBox="0 0 24 24"/);
 assert.match(icon,/<path/);
});

test('footer card spans the shared layout and utility links remain aligned',()=>{
 const latest=css.split('14/10 — FINALIZACAO DO RODAPE + ABA VERTICAL DO WHATSAPP')[1];
 assert.match(latest,/grid-column:1\/-1/);
 assert.match(latest,/\.site-footer\.days-support-ready > \.container/);
 assert.match(latest,/\.footer\.days-support-ready \.footer-inner/);
 assert.match(latest,/\.days-footer-support/);
 assert.match(latest,/\.footer-bottom/);
 assert.match(latest,/@media\(max-width:760px\)/);
 const home=fs.readFileSync(path.join(root,'index.html'),'utf8');
 assert.match(home,/class="footer-utility-links" aria-label="Links úteis do rodapé"/);
 assert.match(home,/Central de Ajuda ↗<\/a><a href="contato\.html">Contato ↗/);
});

test('the same existing contact action remains accessible on all main pages',()=>{
 for(const file of pages){
  const html=fs.readFileSync(path.join(root,file),'utf8');
  assert.equal((html.match(/class="floating-whatsapp"/g)||[]).length,1,file);
  assert.match(html,/aria-label="Falar com a DAYSLUME pelo WhatsApp"/,file);
  assert.match(html,/https:\/\/wa\.me\/5531994492474/,file);
  const cssLinks=[...html.matchAll(/href="((?:\.\.\/)?assets\/css\/[^"]+\.css)"/g)].map(match=>match[1]);
  assert.match(cssLinks.at(-1)||'',/brand-palette\.css$/,file);
 }
});

test('mobile footer intersection hides the floating shortcut on every main page',()=>{
 const shared=fs.readFileSync(path.join(root,'assets/js/dayslume-motion.js'),'utf8');
 assert.match(shared,/const mobileFooter = matchMedia\('\(max-width: 800px\)'\)/);
 assert.match(shared,/footerBounds\.top < innerHeight && footerBounds\.bottom > 0/);
 assert.match(shared,/new IntersectionObserver\(requestUpdate/);
 assert.match(shared,/action\.classList\.toggle\('is-hidden-near-footer', nearMobileFooter\)/);
 assert.match(shared,/mobileFooter\.addEventListener\('change', requestUpdate\)/);
 assert.match(shared,/action\.tabIndex = -1/);
 assert.match(css,/@media\(max-width:800px\)\{[\s\S]*?a\.floating-whatsapp\.is-hidden-near-footer/);
 assert.match(css,/opacity:0!important;[\s\S]*?visibility:hidden!important;[\s\S]*?pointer-events:none!important/);
 for (const file of [...pages,'central-de-ajuda.html','blog/ia-negocios-com-criterio.html']) {
   const html=fs.readFileSync(path.join(root,file),'utf8');
   const prefix=file.includes('/')?'../':'';
   assert.ok(html.includes('src="'+prefix+'assets/js/dayslume-motion.js"'),file);
 }
});

test('mobile support CTA sizes never inherit a vertical flex-basis of 135px',()=>{
 const closing=css.split('14/10 — mobile closeout: compact CTAs')[1];
 assert.ok(closing,'missing final mobile refinements');
 assert.match(closing,/\.days-footer-support-actions a/);
 assert.match(closing,/flex:0 0 46px;/);
 assert.match(closing,/height:46px;/);
 assert.match(closing,/min-height:46px;/);
 assert.match(closing,/max-height:46px;/);
 assert.match(closing,/border-radius:999px;/);
});

test('mobile WhatsApp uses a compact icon and respects overlapping links',()=>{
 const closing=css.split('14/10 — mobile closeout: compact CTAs')[1];
 assert.ok(closing);
 assert.match(closing,/width:48px;/);
 assert.match(closing,/height:48px;/);
 assert.match(closing,/content:none!important;/);
 assert.match(closing,/whatsapp-brand-mark\\.svg/);
 assert.match(closing,/a\\.floating-whatsapp\\.is-context-hidden/);
 assert.match(closing,/a\\.floating-whatsapp\\.is-hidden-near-footer/);
 assert.match(closing,/pointer-events:none!important;/);
});
