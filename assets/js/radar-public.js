/* DAYSLUME Radar público — sem envio automático. */
(()=>{'use strict';
const stage=document.querySelector('[data-diagnostic-stage]'),api=window.DayslumeRadar;if(!stage||!api)return;
const {questions,assess,messageFor}=api,answers=[];let step=0;
const el=(tag,cls,text)=>{const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;};
const btn=(text,cls,fn)=>{const n=el('button',cls,text);n.type='button';n.addEventListener('click',fn);return n;};
const link=(text,href,cls)=>{const n=el('a',cls,text);n.href=href;return n;};
const options=[['yes','Sim, está bem estruturado'],['partial','Em parte / preciso melhorar'],['no','Ainda não'],['unknown','Não sei avaliar']];
function render(focus=false){
 stage.closest('.solutions-hero-layout')?.classList.toggle('radar-result-active',step===questions.length);
 const frame=el('div','diagnostic-frame'),heading=el('h3','diagnostic-question');heading.tabIndex=-1;
 if(step<questions.length){
 const q=questions[step],meta=el('div','diagnostic-meta','PERGUNTA '+(step+1)+' DE '+questions.length),bar=el('progress','radar-progress');bar.max=questions.length;bar.value=step;bar.setAttribute('aria-label','Perguntas respondidas');
 heading.textContent=q.question;frame.append(meta,bar,heading);
 const choices=el('div','diagnostic-options');for(const [value,label] of options){const b=btn(label,'diagnostic-option',()=>{answers[step]=value;step++;render(true)});b.setAttribute('aria-pressed',String(answers[step]===value));choices.append(b);}frame.append(choices);
 if(step)frame.append(btn('← Voltar','diagnostic-back',()=>{step--;render(true)}));
 }else{
 const r=assess(answers);heading.textContent='Seu próximo passo começa aqui.';frame.append(heading,el('p','diagnostic-result-text','Autoavaliação: '+r.known+' de '+r.total+' dimensões informadas. '+r.met+' estruturadas, '+r.partial+' parciais, '+r.gaps+' a desenvolver e '+r.unknown+' não avaliadas. Não verificamos seus canais externos.'));
 const gaps=r.opportunities.filter(x=>x.status!=='unknown'),unknown=r.opportunities.filter(x=>x.status==='unknown');
 if(gaps.length){frame.append(el('h4','radar-subtitle','Prioridades sugeridas'));for(const q of gaps.slice(0,3)){const item=el('div','radar-priority');item.append(el('strong','',q.label),el('p','',q.action),link('Conhecer '+q.service+' ↗',q.href,'radar-link'));frame.append(item);}}
 else frame.append(el('p','diagnostic-result-text',r.known?'Não identificamos lacunas nos critérios informados. Uma auditoria profissional pode confirmar o cenário.':'Ainda não há informações suficientes para indicar prioridades.'));
 if(unknown.length)frame.append(el('p','diagnostic-result-text','A verificar: '+unknown.map(q=>q.label).join(', ')+'.'));
 const report=['RADAR DAYSLUME — Autoavaliação não auditada','Dimensões informadas: '+r.known+'/'+r.total,...questions.map((q,i)=>q.label+': '+options.find(o=>o[0]===answers[i])[1]),'Prioridades:',...gaps.map(q=>q.label+' — '+q.action),'Não é IPD verificado nem promessa de resultados.'].join('\n');
 frame.append(btn('Salvar relatório em texto','diagnostic-secondary',()=>{const url=URL.createObjectURL(new Blob([report],{type:'text/plain;charset=utf-8'}));const a=el('a');a.href=url;a.download='radar-dayslume.txt';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}));
 frame.append(el('h4','radar-subtitle','Quer uma avaliação profissional?'));
 const form=el('form','radar-contact');const fields={};
 for(const [key,label,max] of [['business','Nome do negócio (opcional)',120],['region','Cidade / região (opcional)',100],['site','Site público (opcional)',180],['social','Instagram ou rede social pública (opcional)',180]]){const l=el('label','',label),input=el('input');input.name=key;input.maxLength=max;input.autocomplete='off';if(key==='site')input.type='url';fields[key]=input;l.append(input);form.append(l);}
 const consent=el('label','radar-consent'),check=el('input');check.type='checkbox';check.required=true;consent.append(check,el('span','','Quero preparar uma mensagem com os dados informados e as prioridades para solicitar atendimento. Quando houver um código de divulgação reconhecido, ele aparecerá na mensagem. O WhatsApp receberá o texto ao abrir o link; o envio à DAYSLUME depende da minha confirmação.'));form.append(consent);
 const submit=el('button','diagnostic-primary','Preparar mensagem');submit.type='submit';const preview=el('textarea','radar-preview');preview.readOnly=true;preview.hidden=true;preview.setAttribute('aria-label','Mensagem preparada para revisão');const go=link('Abrir WhatsApp e revisar envio ↗','#','diagnostic-primary');go.hidden=true;go.target='_blank';go.rel='noopener noreferrer';const msg=el('p','diagnostic-result-text');msg.setAttribute('role','status');
 form.append(submit,preview,go,msg);
 form.addEventListener('input',()=>{preview.hidden=true;go.hidden=true;go.removeAttribute('href');msg.textContent='';});
 form.addEventListener('submit',e=>{e.preventDefault();if(!check.checked)return;const profile=Object.fromEntries(Object.entries(fields).map(([k,v])=>[k,v.value.trim()]));try{if(profile.site){const u=new URL(profile.site);if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Informe um endereço público HTTP ou HTTPS.');profile.site=u.origin+u.pathname;}profile.source=api.campaignSource(window.location.search);const text=messageFor(r,profile);preview.value=text;preview.hidden=false;go.href='https://wa.me/5531994492474?text='+encodeURIComponent(text);go.hidden=false;msg.textContent='Revise antes de abrir o WhatsApp.';}catch(err){msg.textContent=err.message;}});
 frame.append(form,btn('Refazer diagnóstico','diagnostic-reset',()=>{answers.length=0;step=0;render(true)}));
 }
 stage.replaceChildren(frame);if(focus){heading.focus({preventScroll:true});const bounds=heading.getBoundingClientRect();if(bounds.top<115||bounds.bottom>window.innerHeight-24)heading.scrollIntoView({block:'start',behavior:'instant'});}
}
render();
})();
