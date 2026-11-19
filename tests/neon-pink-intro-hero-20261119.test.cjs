const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const palette=read('assets/css/brand-palette.css');
const film=read('assets/css/cinematic-film-intro-33.css');
const hero=read('assets/css/hero-project-simulators-20261118.css');
const html=read('index.html');
test('pink neon token exists without replacing plum as the primary identity',()=>{
  assert.match(palette,/--ds-neon-pink: #FF3D9A;/);
  assert.match(palette,/--plum-mineral: #6B536D;/);
});
test('the scroll film has visible neon details in every caption and on its opening rule',()=>{
  assert.match(film,/#cinema33-film \\.c33-caption em \\{[^}]*color: var\\(--ds-neon-pink\\)/);
  assert.match(film,/#cinema33-film \\.c33-title-rule \\{[^}]*var\\(--ds-neon-pink\\)/s);
  assert.match(film,/#cinema33-film \\.c33-hint \\{[^}]*color: var\\(--ds-neon-pink\\)/s);
  assert.equal((html.match(/data-c33-caption/g)||[]).length,5);
});
test('the actual hero high-specificity text rule overrides the legacy peach color',()=>{
  assert.match(hero,/body\\.home-page #apresentacao\\[data-hero-master\\]\\.hero--project-simulators \\.hero-content h1 em/);
  assert.match(hero,/-webkit-text-fill-color:var\\(--ds-neon-pink\\)/);
  assert.match(hero,/hero-projects__card \\{[^}]*--ds-neon-pink-rgb/s);
  assert.match(hero,/@media \\(max-width:600px\\)/);
  assert.match(hero,/@media \\(prefers-reduced-motion:reduce\\)/);
});
