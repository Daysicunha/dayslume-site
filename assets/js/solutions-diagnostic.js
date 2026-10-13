/* DAYSLUME · Diagnóstico digital: três perguntas, indicação orientativa, zero API. */
(() => {
  'use strict';
  const root=document.querySelector('[data-days-diagnostic]');
  const stage=root?.querySelector('[data-diagnostic-stage]');
  if(!stage)return;
  const questions=[
    {title:'Qual é o maior desafio do seu negócio hoje?',options:[
      {label:'As pessoas não encontram meu negócio',key:'presenca'},
      {label:'Recebo visitas, mas poucos contatos',key:'conversao'},
      {label:'Perco tempo com tarefas manuais',key:'operacao'},
      {label:'Preciso apresentar melhor meus produtos',key:'vitrini'}
    ]},
    {title:'Como você trabalha no digital atualmente?',options:[
      {label:'Dependo do Instagram e WhatsApp',key:'presenca'},
      {label:'Tenho um site, mas não gera resultados',key:'conversao'},
      {label:'Uso planilhas e mensagens desconectadas',key:'operacao'},
      {label:'Tenho catálogo e links espalhados',key:'vitrini'}
    ]},
    {title:'O que faria mais diferença agora?',options:[
      {label:'Ter presença própria e ser encontrado',key:'presenca'},
      {label:'Transformar interesse em oportunidades',key:'conversao'},
      {label:'Organizar e simplificar a operação',key:'operacao'},
      {label:'Exibir ofertas e facilitar pedidos',key:'vitrini'}
    ]}
  ];
  const results={
    presenca:{
      title:'Site institucional e presença digital',
      description:'Seu próximo passo pode ser reunir informações, serviços e formas de contato em um endereço próprio, claro e preparado para buscas.',
      href:'sites-completos.html',
      action:'Conhecer sites completos ↗'
    },
    conversao:{
      title:'Landing page orientada à conversão',
      description:'Uma página com mensagem, prova e chamada para ação bem organizadas pode ajudar cada visitante a entender sua oferta e avançar.',
      href:'landing-pages.html',
      action:'Conhecer landing pages ↗'
    },
    operacao:{
      title:'ENGRENI ou sistema sob medida',
      description:'Vale mapear o processo antes de desenvolver: agenda, cadastros e controles podem ficar mais claros e exigir menos retrabalho.',
      href:'solucoes.html#engreni',
      action:'Conhecer o ENGRENI ↗'
    },
    vitrini:{
      title:'VITRINI e apresentação de produtos',
      description:'Uma vitrine digital pode organizar produtos e serviços, facilitar o entendimento da oferta e criar um caminho direto para o contato.',
      href:'vitrini.html',
      action:'Conhecer o VITRINI ↗'
    }
  };
  const weights=[3,1,2],answers=[];
  let step=0;
  const element=(tag,className,text)=>{
    const node=document.createElement(tag);
    if(className)node.className=className;
    if(text!==undefined)node.textContent=text;
    return node;
  };
  const add=(parent,...children)=>children.forEach(child=>parent.appendChild(child));
  const button=(label,className,onClick)=>{
    const node=element('button',className,label);
    node.type='button';
    node.addEventListener('click',onClick);
    return node;
  };
  function recommendation(){
    const scores={presenca:0,conversao:0,operacao:0,vitrini:0};
    answers.forEach((answer,index)=>{
      const key=questions[index]?.options[answer]?.key;
      if(key)scores[key]+=weights[index];
    });
    const primary=questions[0].options[answers[0]].key;
    const ranked=Object.keys(scores).sort((a,b)=>scores[b]-scores[a] ||
      Number(b===primary)-Number(a===primary));
    return {key:ranked[0],...results[ranked[0]]};
  }
  function render(focus){
    const frame=element('div','diagnostic-frame');
    const meta=element('div','diagnostic-meta');
    const heading=element('h3','diagnostic-question');
    heading.tabIndex=-1;
    if(step<questions.length){
      add(meta,
        element('span','','PERGUNTA '+String(step+1).padStart(2,'0')+' DE 03'),
        element('span','',Math.round((step+1)/3*100)+'%')
      );
      const progress=element('div','diagnostic-progress');
      progress.setAttribute('role','progressbar');
      progress.setAttribute('aria-label','Progresso do diagnóstico');
      progress.setAttribute('aria-valuemin','0');
      progress.setAttribute('aria-valuemax','3');
      progress.setAttribute('aria-valuenow',String(step+1));
      const fill=element('span','diagnostic-progress-fill');
      fill.style.setProperty('--diagnostic-progress',((step+1)/3*100).toFixed(2)+'%');
      add(progress,fill);
      heading.textContent=questions[step].title;
      const options=element('div','diagnostic-options');
      questions[step].options.forEach((choice,index)=>{
        add(options,button(choice.label,'diagnostic-option',()=>{
          answers[step]=index;
          step+=1;
          render(true);
        }));
      });
      add(frame,meta,progress,heading,options);
      if(step>0){
        add(frame,button('← Voltar à pergunta anterior','diagnostic-back',()=>{
          step-=1;
          answers.length=step;
          render(true);
        }));
      }
    } else {
      const result=recommendation();
      add(meta,
        element('span','','SUA DIREÇÃO DIGITAL'),
        element('span','','03 / 03')
      );
      heading.textContent='Um ponto de partida para seu negócio';
      const title=element('p','diagnostic-result-name',result.title);
      const description=element('p','diagnostic-result-text',result.description);
      const actions=element('div','diagnostic-result-actions');
      const learn=element('a','diagnostic-primary',result.action);
      learn.href=result.href;
      const chat=element('a','diagnostic-secondary','Conversar sobre essa direção ↗');
      const challenge=questions[0].options[answers[0]].label;
      const message='Olá! Fiz o diagnóstico digital da DAYSLUME.\nPrincipal desafio: '+
        challenge+'.\nDireção sugerida: '+result.title+
        '.\nGostaria de conversar sobre meu projeto.';
      chat.href='https://wa.me/5531994492474?text='+encodeURIComponent(message);
      chat.target='_blank';
      chat.rel='noopener noreferrer';
      add(actions,learn,chat);
      add(frame,meta,heading,title,description,actions,
        button('↻ Refazer diagnóstico','diagnostic-reset',()=>{
          step=0;
          answers.length=0;
          render(true);
        }));
    }
    stage.replaceChildren(frame);
    if(focus)heading.focus();
  }
  render(false);
})();
