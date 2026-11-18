const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync}=require('node:fs');
const {join}=require('node:path');
const css=readFileSync(join(__dirname,'..','assets/css/hero-project-simulators-20261118.css'),'utf8');
test('Hero keeps all three project screens and a central foreground agenda',()=>{
 for(const selector of ['.hero-projects__card--vitrini','.hero-projects__card--agenda','.hero-projects__card--caderneta'])assert.ok(css.includes(selector),selector);
 assert.match(css,/perspective:1500px;transform-style:flat;/);
 assert.match(css,/z-index:4;left:33%;top:20%;width:53%;height:67%/);
 assert.match(css,/z-index:3;right:-1%;top:6%;width:32%;height:61%/);
 assert.match(css,/z-index:2;left:-1%;top:29%;width:41%;height:58%/);
 assert.match(css,/@media \(max-width:600px\)/);
 assert.match(css,/@media \(prefers-reduced-motion:reduce\)/);
});
