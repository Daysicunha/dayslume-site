const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=name=>fs.readFileSync(path.join(__dirname,'..',name),'utf8');

test('Lote E provides one non-floating top menu in both film and commercial home',()=>{
 const html=read('index.html'),nav=read('assets/css/brand-palette.css');
 const script=read('assets/js/cinematic-film-intro-33.js');
 assert.equal((html.match(/<header class="site-header">/g)||[]).length,1);
 assert.equal((html.match(/id="menu-principal"/g)||[]).length,1);
 assert.match(nav,/body\.home-page > header\.site-header/);
 assert.match(nav,/position: fixed !important/);
 assert.match(nav,/width: 100% !important/);
 assert.match(nav,/body\.home-page\.c33-intro-active > header\.site-header/);
 assert.match(nav,/background: #050608 !important/);
 assert.match(script,/header\.inert = false/);
 assert.doesNotMatch(script,/header\.inert = isVisible/);
 assert.match(nav,/\.menu\.open/);
 assert.match(nav,/home-nav-ready/);
});

test('Lote E removes film UI and hero decorative copy marked in screenshots',()=>{
 const html=read('index.html');
 const css=read('assets/css/cinematic-film-intro-33.css');
 const js=read('assets/js/cinematic-film-intro-33.js');
 for(const t of ['DAYSLUME / FILME INTERATIVO','PULAR ABERTURA','CENA 1 · ABERTURA','INTERFACES ILUSTRATIVAS · SEM DADOS REAIS','01 / ABERTURA · O DIGITAL GANHA FORMA'])
  assert.ok(!html.includes(t),t);
 for(const marker of ['c33-topbar','c33-bottombar','data-c33-time','class="cinema-signature"','class="cinema-art-foot"','class="cinema33-ledger__scene"'])
  assert.ok(!html.includes(marker),marker);
 assert.doesNotMatch(js,/scene\.textContent|time\.textContent/);
 assert.doesNotMatch(css,/\.c33-topbar|\.c33-bottombar/);
 assert.match(html,/cinema33-ledger__link" href="#produtos"/);
});

test('Lote E reserves reading area and dissolves scene five into original 3D hero',()=>{
 const html=read('index.html'),css=read('assets/css/cinematic-film-intro-33.css'),js=read('assets/js/cinematic-film-intro-33.js');
 assert.equal((html.match(/data-c33-caption/g)||[]).length,5);
 assert.match(css,/#cinema33-film \.c33-window \{ top: 36%; \}/);
 assert.match(css,/#cinema33-film \.c33-caption \{/);
 assert.match(css,/text-wrap: balance/);
 assert.match(css,/--c33-exit-progress/);
 assert.match(js,/pin\.style\.setProperty\('--c33-exit-progress'/);
 assert.match(html,/class="hero hero--cinematic hero--floating-panels"/);
 assert.match(html,/class="cinema-cluster"/);
 for(const x of ['class="cinema-browser"','class="cinema-phone cinema-agenda-panel"','class="cinema-service"'])assert.ok(html.includes(x));
 assert.match(css,/@media \(prefers-reduced-motion: reduce\)/);
});

test('Lote E avoids old repeated film headlines and false prices while preserving contact',()=>{
 const html=read('index.html');
 assert.match(html,/Tecnologia que começa no problema/);
 assert.match(html,/Criamos sites, experiências e sistemas/);
 assert.match(html,/Conte o desafio\./);
 assert.doesNotMatch(html,/R\$ 00,00/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1);
 assert.match(html,/class="c33-film-cta" href="contato.html"/);
 assert.match(html,/id="contact-title"/);
 assert.match(html,/class="site-footer days-support-ready"/);
});

test('Lote E 3D layout has no empty rows reserved for removed signature or captions',()=>{
 const css=read('assets/css/hero-cinematic.css');
 const html=read('index.html');
 assert.match(css,/grid-template-rows: repeat\(4, auto\)/);
 assert.match(css,/grid-template-rows: repeat\(6, auto\)/);
 assert.doesNotMatch(css,/\.cinema-art-foot|\.cinema-signature/);
 assert.doesNotMatch(html,/class="cinema-art-foot"|class="cinema-signature"/);
 const exp=read('assets/css/cinematic-experience-33.css');
 assert.doesNotMatch(exp,/\.cinema33-ledger__scene/);
});
