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
 assert.match(html,/class="hero hero--cinematic hero--floating-panels hero--project-simulators"/);
});

test('hero anchor does not reserve the previous film scene under fixed navigation',()=>{
 assert.match(palette,/body\.home-page #apresentacao \{ scroll-margin-top: 70px; \}/);
 assert.match(palette,/body\.home-page #apresentacao \{ scroll-margin-top: 64px; \}/);
 assert.doesNotMatch(palette,/main > section:is\(#apresentacao,#problemas,#modelo/);
 assert.match(homeBase,/html\{scroll-padding-top:0\}/);
});


test('plum signature v7 increases section atmosphere while retaining color tokens',()=>{
  const hero=read('assets/css/cinematic-floating-panels-20261113.css');
  assert.match(hero,/rgba\(var\(--plum-mineral-rgb\),\.52\)/);
  assert.match(editorial,/rgba\(var\(--plum-mineral-rgb\),\.46\)/);
  assert.match(editorial,/rgba\(var\(--plum-mineral-rgb\),\.30\)/);
  assert.match(editorial,/outline:2px solid var\(--plum-mineral\)/);
  assert.match(palette,/--plum-mineral: #6B536D/);
  assert.doesNotMatch(editorial,/#[A-Fa-f0-9]{6}\b.*plum-v3-neon/);
});

test('Ato 01 uses mineral-plum atmosphere, a one-pixel chapter divider and compact cards',()=>{
  assert.doesNotMatch(editorial,/--c33-seam-mid:|--c33-problems-paper:/);
  assert.match(editorial,/section#problemas\.section \{[^}]*radial-gradient\(ellipse 47% 70% at 79% 38%,rgba\(var\(--plum-mineral-rgb\),\.32\)/s);
  assert.match(editorial,/section#problemas\.section::after \{[^}]*height:1px;/s);
  assert.match(editorial,/\.manifest-concept \{[^}]*min-height:530px;/s);
  assert.match(editorial,/\.manifest-item\.is-active \{[^}]*min-height:171px;/s);
  assert.match(editorial,/grid-template-columns:minmax\(0,42\.2fr\) minmax\(0,57\.8fr\)/);
  assert.match(editorial,/@media \(max-width:600px\)/);
});

test('Ato 02 has mineral plum glass, peach link accents and keeps visual assets',()=>{
 assert.match(editorial,/linear-gradient\(112deg,/);
 assert.match(editorial,/var\(--plum-mineral\) 67%,/);
 assert.match(editorial,/border-bottom: 1px solid rgba\(var\(--peach-rgb\),\.66\)/);
 assert.match(html,/modelo-project-art/);
 assert.match(html,/modelo-product-tile--engreni/);
});

test('premium cards own their glass and shadow without global important overrides',()=>{
 const paletteRules=palette.slice(palette.indexOf('/* Shared card depth'));
 assert.doesNotMatch(paletteRules,/\.manifest-item,\n\.launch-pillars/);
 assert.doesNotMatch(paletteRules,/\.manifest-item:hover,\n\.launch-pillars/);
 assert.match(editorial,/backdrop-filter:blur\(13px\) saturate\(1\.07\)/);
 assert.match(editorial,/backdrop-filter: blur\(15px\) saturate\(1\.04\)/);
 assert.match(editorial,/stroke-width:1\.35/);
 assert.match(editorial,/stroke-width:1\.4/);
});
test('chapter rules illuminate borders and preserve reduced-motion preferences',()=>{
 assert.match(editorial,/\/\* Divisórias editoriais de um pixel/);
 assert.match(editorial,/inset 0 1px 0 rgba\(var\(--peach-rgb\),\.58\)/);
 assert.match(editorial,/translate:none !important/);
});

test('modelo floating Engreni and 3D base preserve desktop and mobile framing',()=>{
 assert.match(editorial,/\.modelo-product-tile--engreni\s*\{\s*right: 17%;\s*top: 43%;/);
 assert.match(editorial,/\.modelo-product-platform\s*\{[^}]*width: 57%;[^}]*height: 24%;[^}]*right: 16%;[^}]*bottom: 17%;/s);
 assert.match(editorial,/@media \(max-width: 540px\)/);
 assert.match(editorial,/\.modelo-product-platform\s*\{[^}]*width: 47%;[^}]*height: 27%;[^}]*right: 21%;[^}]*bottom: 18%;/s);
 assert.match(editorial,/\.modelo-product-tile--engreni\s*\{\s*right: 17%;\s*top: 35%;/);
 assert.doesNotMatch(editorial,/#A37B9F|#CAA0B7/);
});

test('thin iconography and mineral-plum signature remain coherent across acts',()=>{
 const section=(name,following)=>editorial.slice(editorial.indexOf('/* '+name),editorial.indexOf('/* '+following));
 assert.match(editorial,/section#problemas\.section \.manifest-benefit-icon \{[^}]*width:30px;/s);
 assert.match(editorial,/\.manifest-benefit-icon svg \{[^}]*stroke-width:1\.35;/s);
 assert.match(editorial,/\.modelo-product-tile svg \{[^}]*width: 24px;[^}]*stroke-width: 1\.2;/s);
 assert.match(editorial,/\.products-heading-tile svg \{[^}]*stroke-width:1\.4;/s);
 assert.match(editorial,/\.about-process-icon svg \{[^}]*stroke-width:1\.4;/s);
 assert.match(html,/class="case-step-icon"[^>]+stroke-width="1\.4"/);
 assert.match(html,/class="manifest-benefit-icon"[^>]*><svg[^>]+stroke-width="1\.35"/);
 assert.match(html,/class="about-process-icon"[^>]*><svg[^>]+stroke-width="1\.4"/);
 assert.match(editorial,/ellipse 56% 63% at 58% 32%,rgba\(var\(--plum-mineral-rgb\),\.46\)/);
 assert.match(editorial,/var\(--ink-deep\) 66%,var\(--plum-mineral\)/);
 assert.doesNotMatch(editorial,/#E5ACE2/);
 assert.match(editorial,/section#problemas\.section::after \{[^}]*height:1px;/s);
 assert.match(editorial,/@media \(prefers-reduced-motion:reduce\)/);
});

test('selected showroom control uses mineral plum, not historical lilac',()=>{
 assert.match(editorial,/\.cinema33-showroom__choices button\[aria-pressed="true"\] \{[^}]*background: var\(--plum-mineral\);[^}]*color: var\(--warm-ivory\);/s);
 assert.doesNotMatch(editorial,/#D9A3DD|#E6B8E9|#E1A9DF|#E7B3E6/);
 assert.match(palette,/--plum-mineral: #6B536D/);
});


test('Act II wave is outside the copy column and fades at the section floor',()=>{
  const problem=html.split('id="problemas"')[1].split('id="modelo"')[0];
  const listPos=problem.indexOf('class="manifest-list"');
  const wavePos=problem.indexOf('class="manifest-waves"');
  assert.ok(listPos>=0 && wavePos>listPos,'wave remains a section-level decorative sibling');
  assert.equal((problem.match(/class="manifest-waves"/g)||[]).length,1);
  assert.match(editorial,/section#problemas\.section > \.manifest-waves \{[^}]*width:42\.2%;[^}]*mask-image:radial-gradient/s);
  assert.match(palette,/:not\(#problemas\)::after/);
});

test('Six editorial acts inherit mineral-plum depth without legacy lilac accents',()=>{
  const contents=read('assets/css/contents-cinematic-33.css');
  for(const section of ['modelo','produtos','projetos','sobre','contato']){
    assert.match(editorial,new RegExp('section#'+section+'[.]section'));
  }
  assert.match(contents,/section#conteudos\.contents-cinematic \{[^}]*--plum-mineral-rgb/s);
  assert.match(contents,/backdrop-filter:blur\(11px\) saturate\(1\.06\)/);
  assert.match(editorial,/Costuras luminosas unificadas/);
  for(const hex of ['#EDB9F0','#E8B8ED','#E5AEEB','#F0B8F6','#EEB7EA']){
    assert.ok(!editorial.includes(hex) && !contents.includes(hex),hex);
  }
  for(const label of ['cases-neon-waves','founder-neon-waves','contents-neon-waves','contact-neon-waves']){
    assert.match(html,new RegExp('class="'+label+'"'));
  }
});
