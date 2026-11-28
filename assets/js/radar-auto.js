/* Radar Auto: seção piloto, exibida apenas quando o servidor habilitar. */
(()=>{'use strict';
const host=document.querySelector('[data-radar-auto]');if(!host)return;
const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text)n.textContent=text;if(cls)n.className=cls;return n;};
async function start(){
 try{const cap=await fetch('/api/radar-auto',{cache:'no-store',credentials:'same-origin'});if(!cap.ok||!(await cap.json()).enabled)return;}catch{return;}
 host.hidden=false;
 const form=host.querySelector('form'),out=host.querySelector('[data-auto-result]'),button=form.querySelector('button');
 form.addEventListener('submit',async e=>{
  e.preventDefault();if(button.disabled)return;button.disabled=true;out.replaceChildren(el('p','Consultando HTML público…'));
  try{
   const response=await fetch('/api/radar-auto',{method:'POST',credentials:'same-origin',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:form.elements.url.value})});
   const data=await response.json();if(!response.ok)throw Error(data.error||'Consulta indisponível.');
   out.replaceChildren(el('h3','Evidências técnicas da página'),el('p',data.url+' · '+new Date(data.observedAt).toLocaleString('pt-BR')),el('p',data.observedCount+' itens examinados; '+data.reviewCount+' pontos para revisão. Não é o IPD.'));
   const labels={observed:'Observado',review:'Revisar',unknown:'Não verificado'};
   for(const c of data.checks){const card=el('div','','radar-priority');card.append(el('strong',c.label+' — '+labels[c.status]),el('p',c.evidence),el('small',c.action));out.append(card);}
   for(const l of data.limitations)out.append(el('p',l,'diagnostic-result-text'));
   const save=el('button','Exportar evidências JSON','diagnostic-secondary');save.type='button';save.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:'application/json'}));const a=el('a');a.href=url;a.download='radar-auto-evidencias.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});out.append(save);
  }catch(err){out.replaceChildren(el('p',err.message||'Consulta indisponível. Nenhum resultado atribuído.'));}
  finally{button.disabled=false;}
 });
}
start();
})();
