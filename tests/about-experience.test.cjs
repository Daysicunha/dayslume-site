const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const html=fs.readFileSync(path.join(root,'sobre.html'),'utf8');
const js=fs.readFileSync(path.join(root,'assets/js/about-experience.js'),'utf8');
const css=fs.readFileSync(path.join(root,'assets/css/about-experience.css'),'utf8');

test('Sobre hero is concise and offers accessible project/product decision tabs',()=>{
 assert.match(html,/class="hero about-hero"/);
 assert.match(html,/Antes de construir, <em>entendemos o que precisa mudar\.<\/em>/);
 assert.match(html,/data-about-decision/);
 assert.match(html,/role="tablist"/);
 assert.match(html,/id="about-panel-custom"/);
 assert.match(html,/id="about-panel-product"/);
 assert.match(html,/data-about-panel="product" hidden/);
 assert.match(js,/aria-selected/);
 assert.match(js,/ArrowRight/);
 assert.match(js,/ArrowLeft/);
 assert.match(js,/Home/);
 assert.match(js,/End/);
 assert.match(js,/\.hidden=/);
});

test('studio, principles and founder are preserved with trustworthy claims',()=>{
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 for(const anchor of ['o-que-somos','fundadora','principios']){
  assert.match(html,new RegExp('id="'+anchor+'"'));
 }
 assert.equal((html.match(/<details\b/g)||[]).length,5);
 assert.match(html,/VITRINI e ENGRENI/);
 assert.match(html,/Daysi Cunha/);
 assert.match(html,/src="assets\/images\/daysi-sobre.webp"/);
 assert.match(html,/href="projetos.html"/);
 assert.match(html,/href="solucoes.html"/);
 assert.match(html,/href="contato.html"/);
 assert.doesNotMatch(html,/\b\d+%\s*(?:de clientes|de conversão|de aumento)/i);
 assert.ok(fs.existsSync(path.join(root,'assets/images/daysi-sobre.webp')));
});

test('visual layer is isolated and official palette remains loaded last',()=>{
 assert.match(html,/<body class="about-page">/);
 const styles=[...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(match=>match[1]);
 assert.equal(styles.at(-1),'assets/css/brand-palette.css');
 assert.ok(styles.includes('assets/css/about-experience.css'));
 assert.match(html,/src="assets\/js\/about-experience.js"/);
 assert.match(css,/@media\(max-width:1100px\)/);
 assert.match(css,/@media\(max-width:560px\)/);
 assert.match(css, /prefers-reduced-motion:reduce/);
 assert.match(css,/body\.about-page/);
});
