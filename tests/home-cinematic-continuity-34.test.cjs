const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const css = read('assets/css/home-cinematic-continuity-34.css');
const cssFiles = [...html.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m => m[1]);
const sections = ['problemas','modelo','produtos','projetos','sobre','conteudos','contato'];

test('3.4: canonical tokens remain last; home story is isolated to the Home', () => {
  assert.match(html, /<body class="home-page" data-c33-editorial data-home34-story>/);
  assert.equal(cssFiles.at(-1), 'assets/css/brand-palette.css');
  assert.equal(cssFiles.at(-2), 'assets/css/home-cinematic-continuity-34.css');
  assert.equal(cssFiles.filter(x => x.endsWith('home-cinematic-continuity-34.css')).length, 1);
  assert.match(css, /body\.home-page\[data-home34-story\]/);
  assert.doesNotMatch(css, /body\s*\{\s*background/);
});

test('3.4.2: seven Home sections keep seamless boundaries without chapter captions', () => {
  assert.equal((html.match(/class="home34-boundary"/g) || []).length, 7);
  assert.equal((html.match(/class="home34-chapter"/g) || []).length, 0);
  for (const id of sections) {
    assert.ok(html.includes('id="' + id + '"'), id + ' section');
    assert.match(css, new RegExp('section#' + id + '(?:\\.section)?'));
  }
  assert.doesNotMatch(html,/01 \/ DESCOBERTA|02 \/ TRANSFORMAÇÃO|03 \/ MATERIALIZAÇÃO|04 \/ AUTORIA|05 \/ CONEXÃO/);
  assert.deepEqual([...html.matchAll(/section-eyebrow__number">(\d\d)</g)].map(m=>m[1]),
    ['01','02','03','04','05','06','07']);
});

test('3.4: original film, real simulators, cases, founder and contact are untouched', () => {
  const hero=html.split('id="apresentacao"')[1]?.split('id="problemas"')[0]||'';
  assert.ok(html.includes('id="cinema33-film"'));
  for (const name of ['vitrini','agenda','caderneta'])
    assert.ok(hero.includes('hero-projects__card--'+name),name);
  assert.doesNotMatch(hero,/hero-flower|hero-floral|hero-bloom|hero-petals|flower-petal|data-flower-petal/);
  assert.match(css,/\.hero-flower/);
  assert.ok(html.includes('daysi-cunha-editorial.jpg'));
  assert.equal((html.match(/class="project-card flagship-case/g)||[]).length,3);
  assert.match(html,/class="contact-form" id="contact-form" hidden/);
});

test('3.4: transitional backgrounds, fine light thread and responsive safety exist', () => {
  for (const token of ['#202532','#6B536D','#F3EFE8','#D8B6A5','#FF3D9A'])
    assert.ok(css.includes(token),token);
  assert.match(css,/\.home34-boundary::before/);
  assert.match(css,/\.home34-boundary::after/);
  assert.match(css,/@media \(max-width:760px\)/);
  assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
  assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
});

test('3.4.2: compact content rhythm and soft bottom-anchored wave are scoped to Home',()=>{
  assert.match(css,/DAYSLUME 3\.4\.2 — ritmo editorial depurado/);
  assert.match(css,/\.container\.launch-manifest-grid \{/);
  assert.match(css,/\.manifest-concept \{\s*min-height:0;/);
  assert.match(css,/width:min\(68%,950px\)/);
  assert.match(css,/mask-image:linear-gradient\(90deg,transparent 0%/);
  assert.match(html,/class="manifest-waves" viewBox="0 0 700 170"/);
  assert.doesNotMatch(html,/L700 290 L0 290Z/);
  assert.match(css,/@media \(max-width:600px\)/);
});

test('3.4 final: Hero orbit is removed and transitions remain inside Home',()=>{
  const hero=read('assets/css/hero-project-simulators-20261118.css');
  assert.match(hero,/\.hero-master-orbit \{display:none;pointer-events:none;\}/);
  assert.match(hero,/\.cinema-stage::after \{content:none;display:none;\}/);
  assert.match(css,/#202532 128px/);
  assert.match(css,/\.execution-proof \{[\s\S]*?background:linear-gradient\(120deg,#202532,#353044\)/);
  assert.match(css,/\.case-conversion p \{\s*font-size:13px/);
  assert.match(css,/::placeholder \{\s*color:#4F586D/);
  assert.match(css,/\.contents-editorial-ribbon \{\s*height:clamp\(85px/);
});
test('3.4 final: WCAG AA solid color pairs for critical components',()=>{
  const lum=h=>{
    const channels=h.replace('#','').match(/../g).map(x=>parseInt(x,16)/255)
      .map(x=>x<=.04045?x/12.92:((x+.055)/1.055)**2.4);
    return channels[0]*.2126+channels[1]*.7152+channels[2]*.0722;
  };
  const ratio=(a,b)=>{const l=[lum(a),lum(b)].sort((x,y)=>y-x);return (l[0]+.05)/(l[1]+.05);};
  for(const [fg,bg] of [
    ['#F3EFE8','#202532'],['#F3EFE8','#353044'],
    ['#F3EFE8','#6B536D'],['#202532','#F3EFE8'],
    ['#4F586D','#F3EFE8'],['#604861','#F3EFE8'],
    ['#574158','#F3EFE8'],['#F0C9B5','#202532']
  ]) assert.ok(ratio(fg,bg)>=4.5,fg+' on '+bg+' contrast '+ratio(fg,bg).toFixed(2));
});

test('3.4 final: orbit hide rules outrank the older hero-master attribute selectors',()=>{
  const hero=read('assets/css/hero-project-simulators-20261118.css');
  assert.match(hero,/body\.home-page #apresentacao\[data-hero-master\]\.hero--project-simulators \.hero-master-orbit/);
  assert.match(hero,/body\.home-page #apresentacao\[data-hero-master\]\.hero--project-simulators \.cinema-stage::after/);
});
