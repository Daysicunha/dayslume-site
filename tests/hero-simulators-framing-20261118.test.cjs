const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const css=readFileSync(join(__dirname,'..','assets/css/hero-project-simulators-20261118.css'),'utf8');
test('Hero retains three real linked project interfaces, clear glass hierarchy and responsive support',()=>{
 for(const name of ['vitrini','agenda','caderneta']){
   assert.match(css,new RegExp('\\.hero-projects__card--'+name+' \\{'));
 }
 assert.match(css,/perspective:1500px;transform-style:flat;/);
 assert.match(css,/\.hero-projects__card--agenda \{\s*z-index:4/);
 assert.match(css,/\.hero-projects__card--caderneta \{\s*z-index:3/);
 assert.match(css,/\.hero-projects__card--vitrini \{\s*z-index:2/);
 assert.match(css,/rotateY\(-2\.7deg\) rotateX\(1\.5deg\)/);
 assert.match(css,/@media \(max-width:600px\)/);
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
 assert.match(css,/font-family:var\(--ds-font-display, "Manrope", sans-serif\)/);
});
