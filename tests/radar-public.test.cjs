const test=require('node:test');
const assert=require('node:assert/strict');
const {questions,assess,messageFor,campaignSource}=require('../assets/js/radar-public-core.js');
test('oito dimensões e pesos totalizam 100',()=>{assert.equal(questions.length,8);assert.equal(questions.reduce((s,q)=>s+q.weight,0),100)});
test('desconhecido não é lacuna',()=>{const r=assess(Array(8).fill('unknown'));assert.equal(r.known,0);assert.equal(r.gaps,0);assert.equal(r.unknown,8)});
test('respostas positivas não geram venda forçada',()=>assert.equal(assess(Array(8).fill('yes')).opportunities.length,0));
test('prioridades ponderadas e cobertura',()=>{const r=assess(['no','partial','unknown','yes','yes','yes','yes','yes']);assert.equal(r.known,7);assert.equal(r.opportunities[0].id,'site');assert.equal(r.opportunities.at(-1).status,'unknown')});
test('entrada incompleta ou inválida rejeitada',()=>{assert.throws(()=>assess([]));assert.throws(()=>assess(Array(8).fill('x')))});
test('mensagem não anuncia auditoria verificada',()=>{const m=messageFor(assess(Array(8).fill('unknown')),{business:'Teste\nNegócio'});assert.match(m,/Teste Negócio/);assert.match(m,/não auditada/);assert.doesNotMatch(m,/undefined/)});

test('attribution accepts only a single approved campaign code',()=>{assert.equal(campaignSource('?origem=instagram'),'instagram');for(const s of ['?origem=constructor','?origem=instagram&origem=local','?origem=alguem%40email.com','?origem=__proto__','?email=teste'])assert.equal(campaignSource(s),null);});
test('approved campaign is visible in prepared message; arbitrary values ignored',()=>{const r=assess(Array(8).fill('unknown'));assert.match(messageFor(r,{source:'local'}),/VITRINI Local/);assert.doesNotMatch(messageFor(r,{source:'alguem@email.com'}),/alguem@email/);});
