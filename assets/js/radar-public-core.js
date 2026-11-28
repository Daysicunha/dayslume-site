/* Radar público: autoavaliação, não IPD verificado. Sem rede. */
(function(root){'use strict';
const questions=[
  {
    "id": "site",
    "label": "Site e apresentação",
    "question": "Seu negócio tem uma página própria com informações atualizadas?",
    "weight": 20,
    "action": "Organizar uma página própria com serviços, produtos e formas de contato.",
    "service": "Sites e VITRINI",
    "href": "sites-completos.html"
  },
  {
    "id": "google",
    "label": "Descoberta local",
    "question": "Os clientes conseguem encontrar informações corretas sobre seu negócio nas buscas?",
    "weight": 15,
    "action": "Conferir a elegibilidade do Perfil da Empresa no Google e a consistência das informações públicas.",
    "service": "DAYSLUME Presença",
    "href": "presenca.html"
  },
  {
    "id": "conversion",
    "label": "Atendimento e conversão",
    "question": "É fácil entender sua oferta e solicitar um orçamento ou fazer um pedido?",
    "weight": 15,
    "action": "Simplificar a jornada de contato, organizar a oferta e revisar chamadas para ação.",
    "service": "VITRINI e experiências digitais",
    "href": "vitrini.html"
  },
  {
    "id": "social",
    "label": "Redes sociais",
    "question": "Suas redes têm comunicação atualizada, consistente e planejada?",
    "weight": 15,
    "action": "Definir calendário, conteúdos prioritários e rotina de acompanhamento.",
    "service": "DAYSLUME Presença",
    "href": "presenca.html"
  },
  {
    "id": "brand",
    "label": "Marca e identidade",
    "question": "Sua marca tem uma identidade coerente e uma proposta de valor clara?",
    "weight": 10,
    "action": "Revisar posicionamento, identidade visual e materiais comerciais.",
    "service": "Studio Criativo",
    "href": "studio-criativo.html"
  },
  {
    "id": "reputation",
    "label": "Confiança",
    "question": "Seu negócio apresenta referências, avaliações autênticas ou provas de qualidade?",
    "weight": 10,
    "action": "Organizar evidências autorizadas de qualidade e rotina de resposta aos clientes.",
    "service": "DAYSLUME Presença",
    "href": "presenca.html"
  },
  {
    "id": "ai",
    "label": "Visibilidade em IA",
    "question": "Você já verificou se assistentes de IA descrevem ou recomendam seu negócio corretamente?",
    "weight": 10,
    "action": "Realizar uma amostra independente de perguntas e conferir as informações citadas.",
    "service": "DAYSLUME Radar",
    "href": "presenca.html"
  },
  {
    "id": "measurement",
    "label": "Resultados",
    "question": "Você acompanha de onde chegam os contatos e quais ações geram oportunidades?",
    "weight": 5,
    "action": "Definir indicadores, registrar contatos e acompanhar resultados com regularidade.",
    "service": "DAYSLUME Presença",
    "href": "presenca.html"
  }
];
function assess(answers,questions){
 if(!Array.isArray(answers)||answers.length!==questions.length||answers.some(a=>!["yes","partial","no","unknown"].includes(a)))throw Error("Responda todas as perguntas.");
 const known=answers.filter(a=>a!=="unknown").length;
 const opportunities=questions.flatMap((q,i)=>answers[i]==="yes"?[]:[{...q,status:answers[i],priority:answers[i]==="no"?q.weight:answers[i]==="partial"?q.weight/2:0}]).sort((a,b)=>b.priority-a.priority);
 return {known,total:questions.length,met:answers.filter(a=>a==="yes").length,partial:answers.filter(a=>a==="partial").length,gaps:answers.filter(a=>a==="no").length,unknown:answers.filter(a=>a==="unknown").length,opportunities};
}
function messageFor(result,profile){
 const clean=(s,max)=>String(s||"").replace(/[\r\n\t]+/g," ").trim().slice(0,max);
 const rows=result.opportunities.filter(x=>x.status!=="unknown").slice(0,3).map(x=>"- "+x.label+": "+x.action);
 return ["Olá! Gostaria de conversar sobre o Radar DAYSLUME.",clean(profile.business,120)&&"Negócio: "+clean(profile.business,120),clean(profile.region,100)&&"Região: "+clean(profile.region,100),clean(profile.site,180)&&"Site público: "+clean(profile.site,180),clean(profile.social,180)&&"Rede social pública: "+clean(profile.social,180),"Autoavaliação (não auditada): "+result.known+"/"+result.total+" critérios informados.",...rows,"Gostaria de uma avaliação profissional e orientação sobre os próximos passos."].filter(Boolean).join("\n");
}
const api={questions,assess:answers=>assess(answers,questions),messageFor};
if(typeof module==='object'&&module.exports)module.exports=api;else root.DayslumeRadar=api;
})(typeof window!=='undefined'?window:globalThis);
