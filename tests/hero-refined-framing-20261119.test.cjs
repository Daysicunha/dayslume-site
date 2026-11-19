const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const css=fs.readFileSync(path.join(__dirname,'../assets/css/hero-project-simulators-20261118.css'),'utf8');
const palette=fs.readFileSync(path.join(__dirname,'../assets/css/brand-palette.css'),'utf8');
function rule(marker) {const start=css.indexOf(marker),open=css.indexOf('{',start);assert.ok(start>=0,'missing '+marker);return css.slice(open+1,css.indexOf('}',open));}
function measure(name) {
 const r=rule('.hero-projects__card--'+name+' {');
 const pct=(p)=>{const match=r.match(new RegExp('(?:^|;)\\s*'+p+':([\\d.]+)%'));return match?Number(match[1]):null;};
 return {left:pct('left'),right:pct('right'),width:pct('width'),top:pct('top'),height:pct('height'),z:Number((r.match(/z-index:(\d+)/)||[])[1])};
}
test('three screens preserve depth order, a centered agenda, and genuinely visible side panels',()=>{
 const v=measure('vitrini'),a=measure('agenda'),c=measure('caderneta');
 assert.deepEqual([v.z,c.z,a.z],[2,3,4]);
 assert.ok(a.width>v.width&&v.width>c.width,'Agenda must be the largest project preview');
 assert.ok(a.left>=25&&a.left<=35,'Agenda must begin near stage center');
 assert.ok(v.left<=5&&v.left+v.width>a.left,'left preview remains substantial and slightly overlapped');
 const cLeft=100-c.right-c.width, aRight=a.left+a.width;
 assert.ok(c.width>=26,'Caderneta must retain meaningful screen width');
 assert.ok(cLeft>=aRight-2,'Agenda must not obscure the Caderneta content');
 assert.ok(aRight<=78&&cLeft+c.width<=100,'no lateral stage overflow');
 assert.match(rule('.hero-projects__card--agenda {'),/rotateY\(-2\.7deg\)/);
});
test('the official display typeface is restored without removing the pink accent or premium surfaces',()=>{
 assert.match(rule('.hero-content h1 {'),/font-family:var\(--ds-font-display/);
 assert.match(palette,/--ds-font-display: "Manrope", sans-serif;/);
 assert.match(palette,/main > section#apresentacao \.hero-content h1 \{\s*font-family: var\(--ds-home-font-display\)/);
 assert.doesNotMatch(palette,/main > section#apresentacao \.hero-content h1,\s*body\.home-page\[data-c33-editorial\] main > section#contato/);
 assert.match(css,/--ds-neon-pink/);
 assert.match(css,/border:1px solid rgba\(var\(--ds-neon-pink-rgb\),\.32\)/);
});
test('tablet and mobile keep independent readable layouts and reduced-motion fallback',()=>{
 assert.match(css,/@media \(max-width:760px\)/);
 assert.match(css,/@media \(max-width:600px\)/);
 assert.match(css,/grid-template-columns:minmax\(0,1fr\) minmax\(0,1fr\)/);
 assert.match(css,/\.hero-projects__card--agenda \{grid-column:1\/-1;grid-row:1;/);
 assert.match(css,/@media \(max-width:365px\)/);
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
});
test('legacy model clipping on mobile is corrected independently of hero layout',()=>{
 assert.match(palette,/\.modelo-product-platform \{\s*bottom:calc\(18% \+ 8px\)/);
 assert.match(palette,/\.modelo-product-tile--engreni \{\s*top:calc\(35% - 14px\)/);
});
