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
 assert.match(palette,/body\.home-page #apresentacao \{ scroll-margin-top: 0; \}/);
 assert.doesNotMatch(palette,/main > section:is\(#apresentacao,#problemas,#modelo/);
});
