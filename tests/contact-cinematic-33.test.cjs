const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');

const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const home=read('index.html');
const css=read('assets/css/cinematic-editorial-33.css');
const formJs=read('assets/js/dayslume-contact.js');
const motion=read('assets/js/contact-cinematic-motion.js');
const section=home.slice(home.indexOf('id="contato"'),home.indexOf('</section>',home.indexOf('id="contato"'))+10);
const styling=css.split('DAYSLUME — ATO VIII / próximo passo / 17.11.2026 / visual aprovado.')[1]||'';

test('Ato VIII: keeps approved copy, real WhatsApp destination, original form inputs',()=>{
 assert.match(home,/class="section contact-section contact-cinematic-final/);
 assert.match(section,/Vamos entender o que/);
 assert.match(section,/seu negócio precisa\?/);
 assert.match(section,/Conte o que você quer melhorar/);
 assert.match(section,/data-whatsapp="5531994492474"/);
 assert.match(section,/href="https:\/\/wa\.me\/5531994492474\?text=/);
 for(const name of ['nome','email','empresa','necessidade']) {
   assert.ok(section.includes('name="'+name+'"'),name);
 }
 assert.match(section,/class="contact-form" id="contact-form" hidden/);
 assert.match(section,/<button class="btn btn-navy" type="button" disabled>/);
 assert.match(section,/id="form-status" role="status" aria-live="polite"/);
 assert.match(section,/id="contact-privacy" class="contact-privacy"/);
 assert.match(section,/id="whatsapp-submit" hidden/);
 assert.match(section,/rel="noopener noreferrer"/);
});

test('Ato VIII: closing visual includes responsive neon waves, shield and WhatsApp icon',()=>{
 assert.match(section,/class="contact-neon-waves"/);
 assert.match(section,/class="contact-wave-front"/);
 assert.match(section,/class="contact-editorial-copy"/);
 assert.match(section,/class="contact-whatsapp-icon"/);
 assert.match(section,/class="contact-privacy-shield"/);
 assert.match(styling,/section#contato\.section/);
 assert.match(styling,/h2#contact-title/);
 assert.match(styling,/font-family:Georgia/);
 assert.match(styling,/\.contact-form > \.contact-privacy/);
 assert.match(styling,/\.contact-form :is\(input,textarea\):focus-visible/);
 assert.match(styling,/\.contact-form :is\(input,textarea\)\[aria-invalid="true"\]/);
 assert.match(styling,/@media \(max-width:900px\)/);
 assert.match(styling,/@media \(max-width:560px\)/);
 assert.match(styling,/@media \(max-width:360px\)/);
 assert.match(styling,/@media \(prefers-reduced-motion:reduce\)/);
 assert.equal((css.match(/\{/g)||[]).length,(css.match(/\}/g)||[]).length);
 assert.doesNotMatch(styling,/#apresentacao|#cinema33-film|\.hero--floating-panels/);
});

test('Ato VIII: no-JS fallback, form activation and explicit WhatsApp confirmation preserved',()=>{
 assert.match(styling,/form\.contact-form\[hidden\]/);
 assert.match(styling,/display:none!important/);
 assert.match(formJs,/form\.addEventListener\('submit', event =>/);
 assert.match(formJs,/event\.preventDefault\(\)/);
 assert.match(formJs,/form\.reportValidity\(\)/);
 assert.match(formJs,/setCustomValidity\(message\)/);
 assert.match(formJs,/encodeURIComponent\(lines\.join\('\\n'\)\)/);
 assert.match(formJs,/continuation\.hidden = false/);
 assert.match(formJs,/continuation\.focus\(\)/);
 assert.match(formJs,/fields\.forEach\(field => \{ field\.disabled = false; \}\)/);
 assert.match(formJs,/submit\.type = 'submit'/);
 assert.match(formJs,/form\.hidden = false/);
 assert.match(section,/<noscript><p>Para enviar sua solicitação, utilize o link de WhatsApp acima.<\/p><\/noscript>/);
});

test('Ato VIII: environmental motion is viewport-only, accessible and loop-free',()=>{
 assert.match(home,/src="assets\/js\/contact-cinematic-motion\.js" defer/);
 assert.match(motion,/IntersectionObserver/);
 assert.match(motion,/contact-is-visible/);
 assert.match(motion,/contact-has-entered/);
 assert.match(motion,/document\.hidden/);
 assert.match(motion,/navigator\.connection/);
 assert.match(motion,/prefers-reduced-motion: reduce/);
 assert.match(motion,/observer\.observe\(section\)/);
 assert.doesNotMatch(motion,/requestAnimationFrame\s*\(|setInterval\s*\(|setTimeout\s*\(/);
 assert.match(styling,/@keyframes contact-wave-shine/);
 assert.match(styling,/@keyframes contact-form-glow/);
 assert.match(styling,/@keyframes contact-form-appear/);
 const urls=[...home.matchAll(/href="(assets\/css\/[^"]+\.css)"/g)].map(m=>m[1]);
 assert.equal(urls.at(-1),'assets/css/brand-palette.css');
});
