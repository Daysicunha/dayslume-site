const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const read=p=>fs.readFileSync(path.resolve(__dirname,'..',p),'utf8');
const html=read('index.html');
const palette=read('assets/css/brand-palette.css');
const editorial=read('assets/css/cinematic-editorial-33.css');
const film=read('assets/css/cinematic-film-intro-33.css');
const internal=read('assets/css/institucional.css');
const homeBase=read('assets/css/home-premium.css');

test('documented six color tokens and common typography stay consistent',()=>{
 for(const hex of ['#202532','#6B536D','#A9C5D8','#F3EFE8','#66758F','#D8B6A5'])assert.ok(palette.includes(hex),hex);
 assert.match(palette,/--ds-font-display: "Manrope"/);
 assert.match(palette,/--ds-font-body: "DM Sans"/);
 assert.match(internal,/family=Manrope/);
 assert.doesNotMatch(internal,/Montserrat/);
 assert.doesNotMatch(palette,/\/\* ATO II — O notebook inteiro/);
});

test('notebook SVG geometry has internal breathing room and no 155 percent overflow',()=>{
 assert.match(html,/manifest-art-svg" viewBox="14 8 276 238"/);
 assert.match(html,/modelo-project-art" viewBox="58 -6 400 365"/);
 assert.doesNotMatch(editorial,/width: 155%/);
});

test('product keyboards are attached to the UI itself and animate together',()=>{
 assert.match(editorial,/\.solution-graphic > :is\(\.vitrini-ui,\.engreni-ui\)::after/);
 assert.match(editorial,/top:100%/);
 assert.doesNotMatch(editorial,/\.solution-graphic::after/);
 assert.doesNotMatch(editorial,/width:122%/);
 assert.match(editorial,/@keyframes products-device-engreni/);
});

test('Dayane original 1600x900 media fits a 16:9 frame without text overlay',()=>{
 assert.match(html,/case-dayane-mockup" src="assets\/images\/case-engreni-agenda-1600x900\.webp"/);
 assert.match(editorial,/\.home-case-dayane \.project-image\.case-preview--dayane\s*\{\s*aspect-ratio:16 \/ 9/);
 assert.match(editorial,/\.case-dayane-mockup\s*\{[^}]*object-fit:cover/);
 assert.doesNotMatch(html,/case-dayane-copy/);
});

test('last cinema scene hides only its decorative UI fragments',()=>{
 assert.match(film,/#cinema33-film\[data-current-scene="contato"\] \.c33-window/);
 assert.match(html,/A próxima evolução começa com/);
 assert.match(html,/class="hero hero--cinematic hero--floating-panels"/);
});

test('hero anchor does not reserve the previous film scene under fixed navigation',()=>{
 assert.match(palette,/body\.home-page #apresentacao \{ scroll-margin-top: 70px; \}/);
 assert.match(palette,/body\.home-page #apresentacao \{ scroll-margin-top: 64px; \}/);
 assert.doesNotMatch(palette,/main > section:is\(#apresentacao,#problemas,#modelo/);
 assert.match(homeBase,/html\{scroll-padding-top:0\}/);
});


test('plum v3 expands signature selectively and retains existing color tokens',()=>{
  const hero=read('assets/css/cinematic-floating-panels-20261113.css');
  assert.match(hero,/rgba\(var\(--plum-mineral-rgb\),\.38\)/);
  assert.match(editorial,/rgba\(var\(--plum-mineral-rgb\),\.38\)/);
  assert.match(editorial,/rgba\(var\(--plum-mineral-rgb\),\.30\)/);
  assert.match(editorial,/outline:2px solid var\(--plum-mineral\)/);
  assert.match(palette,/--plum-mineral: #6B536D/);
  assert.doesNotMatch(editorial,/#[A-Fa-f0-9]{6}\b.*plum-v3-neon/);
});

test('Ato 01 has one-pixel luminous seam without desaturated gray corridor',()=>{
 assert.doesNotMatch(editorial,/--c33-seam-mid:/);
 assert.match(editorial,/--c33-problems-paper:color-mix/);
 assert.match(editorial,/\.container\.launch-manifest-grid::after\s*\{[^}]*width:1px/s);
 assert.match(editorial,/\.container\.launch-manifest-grid::after\s*\{[^}]*box-shadow:0 0 7px/s);
 assert.match(editorial,/background:linear-gradient\(90deg,var\(--ink-deep\) 0 42\.2%,var\(--c33-problems-paper\) 42\.2% 100%\)/);
});

test('Ato 02 cards use plum accents and preserve their visual assets',()=>{
 assert.match(editorial,/rgba\(var\(--plum-mineral-rgb\),\.21\)/);
 assert.match(editorial,/border-bottom:1\.5px solid rgba\(var\(--plum-mineral-rgb\),\.74\)/);
 assert.match(html,/modelo-project-art/);
 assert.match(html,/modelo-product-tile--engreni/);
});

test('premium cards own their glass and shadow without global important overrides',()=>{
 const paletteRules=palette.slice(palette.indexOf('/* Shared card depth'));
 assert.doesNotMatch(paletteRules,/\.manifest-item,\n\.launch-pillars/);
 assert.doesNotMatch(paletteRules,/\.manifest-item:hover,\n\.launch-pillars/);
 assert.match(editorial,/backdrop-filter:blur\(13px\) saturate\(1\.07\)/);
 assert.match(editorial,/backdrop-filter:blur\(14px\) saturate\(1\.07\)/);
 assert.match(editorial,/stroke-width:1\.6/);
 assert.match(editorial,/stroke-width:1\.7/);
});
test('chapter rules illuminate borders and preserve reduced-motion preferences',()=>{
 assert.match(editorial,/\/\* Divisórias editoriais de um pixel/);
 assert.match(editorial,/inset 0 1px 0 rgba\(var\(--peach-rgb\),\.46\)/);
 assert.match(editorial,/translate:none !important/);
});
