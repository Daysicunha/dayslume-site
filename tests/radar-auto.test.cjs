const test=require('node:test');
const assert=require('node:assert/strict');
const {normalizeTarget,publicIPv4,scanHtml}=require('../lib/radar-auto-core.cjs');
test('pilot allows only exact HTTPS root targets',()=>{
 assert.equal(normalizeTarget('dayslume.daysicunha.com.br').href,'https://dayslume.daysicunha.com.br/');
 for(const u of ['http://dayslume.daysicunha.com.br','https://dayslume.daysicunha.com.br.evil.com','https://evil.com','https://127.0.0.1','https://[::1]','https://169.254.169.254','https://dayslume.daysicunha.com.br@evil.com','https://user@dayslume.daysicunha.com.br','https://dayslume.daysicunha.com.br:8080','https://dayslume.daysicunha.com.br/?secret=1','https://dayslume.daysicunha.com.br/private'])assert.throws(()=>normalizeTarget(u));
});
test('private and special IPv4 blocked',()=>{
 for(const ip of ['0.0.0.0','10.0.0.1','127.0.0.1','169.254.169.254','172.16.0.1','192.168.1.1','100.64.0.1','192.0.2.1','198.18.0.1','198.51.100.1','203.0.113.1','224.0.0.1','255.255.255.255','::1','999.2.3.4'])assert.equal(publicIPv4(ip),false,ip);
 assert.equal(publicIPv4('8.8.8.8'),true);
});
const html='<html><head><title>Example</title><meta name="description" content="Descrição"><meta name="viewport" content="width=device-width"><link rel="canonical" href="https://example.com/"><script type="application/ld+json">{"@type":"Organization"}</script></head><body><h1>Exemplo</h1><img src="image.png" alt=""><a href="https://wa.me/123">Contato</a></body></html>';
const find=(r,k)=>r.checks.find(c=>c.id===k);
test('observations are separated from unverified metrics',()=>{const r=scanHtml(html);assert.equal(r.checks.length,11);assert.equal(find(r,'title').status,'observed');assert.equal(find(r,'schema').status,'observed');assert.equal(find(r,'contact').status,'observed');assert.equal(find(r,'speed').status,'unknown');assert.equal(find(r,'indexed').status,'unknown');assert.equal(r.observedCount,9);});
test('noindex header and invalid JSON detected',()=>{const r=scanHtml(html.replace('{"@type":"Organization"}','invalid'),{robots:'googlebot: noindex'});assert.equal(find(r,'index').status,'review');assert.equal(find(r,'schema').status,'review');});
test('comments and script-generated tags do not count',()=>{const r=scanHtml('<!-- <title>fake</title><script type="application/ld+json">{}</script> --><script>const html="<h1>fake</h1>"</script>');assert.equal(find(r,'title').status,'review');assert.equal(find(r,'schema').status,'review');assert.match(find(r,'h1').evidence,/^0 /);});
test('missing alt and no contact handled honestly',()=>{const r=scanHtml('<img src="x">');assert.equal(find(r,'alt').status,'review');assert.equal(find(r,'contact').status,'unknown');});
