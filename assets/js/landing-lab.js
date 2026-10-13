/* DAYSLUME / Laboratório de Conversão — demonstração local, sem APIs. */
(() => {
  'use strict';
  const root=document.querySelector('[data-lp-lab]');
  if(!root)return;
  const options={
    contatos:{
      brand:'ATENDIMENTO ESPECIALIZADO',
      eyebrow:'CONVERSA INICIAL',
      title:'Seu projeto merece uma conversa.',
      description:'Conte o que você precisa e veja quais podem ser os próximos passos.',
      cta:'Solicitar orçamento ↗',
      reassurance:'Atendimento com orientações claras e sem compromisso automático.',
      action:'Próxima ação: contato',
      contextTitle:'Do interesse ao primeiro contato',
      context:'O visitante entende o serviço e encontra um caminho direto para iniciar a conversa.',
      flow:'Contato',flowDetail:'Iniciar atendimento',
      status:'Exemplo selecionado: captar contatos.'
    },
    ofertas:{
      brand:'OFERTA EM DESTAQUE',
      eyebrow:'CONHEÇA A OFERTA',
      title:'Uma solução feita para sua necessidade.',
      description:'Entenda os diferenciais, confira o que está incluído e descubra como avançar.',
      cta:'Conhecer a oferta ↗',
      reassurance:'Informações transparentes: escopo, condições e próximos passos.',
      action:'Próxima ação: avaliar oferta',
      contextTitle:'Da curiosidade à avaliação',
      context:'A página reúne os detalhes essenciais de uma oferta e permite que a pessoa decida se quer saber mais.',
      flow:'Oferta',flowDetail:'Conhecer os detalhes',
      status:'Exemplo selecionado: apresentar uma oferta.'
    },
    agenda:{
      brand:'AGENDAMENTO DE SERVIÇOS',
      eyebrow:'ATENDIMENTO COM HORA MARCADA',
      title:'Seu próximo horário começa aqui.',
      description:'Conheça o serviço, confira as orientações e avance para solicitar um horário.',
      cta:'Solicitar agendamento ↗',
      reassurance:'A disponibilidade e a confirmação dependem do serviço contratado.',
      action:'Próxima ação: agendamento',
      contextTitle:'Do interesse à solicitação de horário',
      context:'As informações certas reduzem dúvidas e orientam o visitante para a etapa de agendamento.',
      flow:'Agenda',flowDetail:'Solicitar um horário',
      status:'Exemplo selecionado: solicitar agendamentos.'
    }
  };
  const buttons=Array.from(root.querySelectorAll('[data-lp-goal]'));
  const nodes={
    brand:root.querySelector('[data-lp-brand]'),
    eyebrow:root.querySelector('[data-lp-eyebrow]'),
    title:root.querySelector('[data-lp-title]'),
    description:root.querySelector('[data-lp-description]'),
    cta:root.querySelector('[data-lp-cta]'),
    reassurance:root.querySelector('[data-lp-reassurance]'),
    action:root.querySelector('[data-lp-action]'),
    contextTitle:root.querySelector('[data-lp-context-title]'),
    context:root.querySelector('[data-lp-context]'),
    flow:root.querySelector('[data-lp-flow]'),
    flowDetail:root.querySelector('[data-lp-flow-detail]'),
    live:root.querySelector('[data-lp-live]')
  };
  if(buttons.length!==3 || Object.values(nodes).some(node=>!node))return;
  const apply=(goal)=>{
    const next=options[goal];
    if(!next)return;
    root.dataset.lpCurrent=goal;
    for(const button of buttons){
      const active=button.dataset.lpGoal===goal;
      button.classList.toggle('is-active',active);
      button.setAttribute('aria-pressed',String(active));
    }
    for(const [key,node] of Object.entries(nodes)){
      node.textContent=(key==='live'?next.status:next[key])||'';
    }
  };
  buttons.forEach(button=>button.addEventListener('click',()=>apply(button.dataset.lpGoal)));
  apply('contatos');
})();
