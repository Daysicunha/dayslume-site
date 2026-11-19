const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const css=readFileSync(join(__dirname,'..','assets/css/hero-project-simulators-20261118.css'),'utf8');
test('Hero keeps all three project screens and a central foreground agenda',()=>{
 for(const selector of ['.hero-projects__card--vitrini','.hero-projects__card--agenda','.hero-projects__card--caderneta'])assert.ok(css.includes(selector),selector);
 assert.match(css,/perspective:1500px;transform-style:flat;/);
 // Approved 19/11 framing: Agenda centered as foreground; support cards inset and subordinate.
 assert.match(css,/z-index:4;left:36%;top:21%;width:49%;height:67%/);
 assert.match(css,/z-index:3;right:3\.8%;top:7%;width:30%;height:55%/);
 assert.match(css,/z-index:2;left:9%;top:30%;width:40%;height:56%/);
 assert.match(css,/rotateY\(-2\.7deg\) rotateX\(1\.5deg\)/);
 assert.match(css,/@media \(max-width:600px\)/);
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
});
