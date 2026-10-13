const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const read=name=>fs.readFileSync(path.join(root,name),'utf8');
const home=read('index.html');
const products=read('solucoes.html');
const cases=read('projetos.html');
const beta='https://ritmo-daysi-preview.vercel.app/';

test('RITMO lives between products and cases with a real beta destination',()=>{
 assert.ok(home.indexOf('id="produtos"')<home.indexOf('id="ritmo"'));
 assert.ok(home.indexOf('id="ritmo"')<home.indexOf('id="projetos"'));
 assert.match(home,/aria-labelledby="ritmo-feature-title"/);
 assert.ok(home.includes('href="'+beta+'"'));
 assert.match(home,/id="ritmo".*?(?:[\s\S])*?ritmo-qr\.svg/);
 assert.match(home,/Versão de demonstração em testes/);
 assert.doesNotMatch(home,/href="https:\/\/play\.google\.com\/store\/apps\/details[^"]*ritmo/i);
});

test('QR code is a local SVG asset without third-party QR APIs',()=>{
 const qr=read('assets/images/ritmo-qr.svg');
 assert.match(qr,/<svg/);
 assert.match(qr,/viewBox="0 0 35 35"/);
 assert.match(qr,/<path /);
 assert.match(home,/src="assets\/images\/ritmo-qr\.svg"/);
});

test('original VITRINI and ENGRENI demos remain alongside Nauta and RITMO',()=>{
 for(const id of ['vitrini','engreni','engreni-agenda','engreni-nauta','ritmo-produto'])assert.ok(products.includes('id="'+id+'"'),id);
 for(const part of ['data-products-vitrini','data-engreni-lab','data-demo-service','data-demo-time'])assert.ok(products.includes(part),part);
 assert.match(products,/href="https:\/\/engreni-nautadc\.vercel\.app\/"/);
 assert.match(products,/href="https:\/\/ritmo-daysi-preview\.vercel\.app\/"/);
 assert.match(products,/instalação como PWA são possibilidades futuras/);
});

test('projects separate commissioned cases from the owned product showroom',()=>{
 for(const value of ['Tornearia Barbosa','New Rocket Play','Dayane Cunha Nails','Loh Gourmet'])assert.ok(cases.includes(value),value);
 assert.equal((cases.match(/class="box days-card flagship-case projects-case-card/g)||[]).length,4);
 assert.doesNotMatch(cases,/data-filter="product"/);
 assert.match(cases,/link profissional de contato/);
});

test('official palette remains the final stylesheet on all three pages',()=>{
 for(const s of [home,products,cases]){
  const styles=[...s.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(x=>x[1]);
  assert.equal(styles.at(-1),'assets/css/brand-palette.css');
  assert.ok(styles.includes('assets/css/ritmo-showcase.css'));
 }
});
