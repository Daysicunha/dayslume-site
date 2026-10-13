/* DAYSLUME / Produtos — interações locais, sem dependências ou APIs externas. */
(() => {
  const setupTabs = (rootSelector, buttonSelector, panelSelector, attr, statusSelector) => {
    const root = document.querySelector(rootSelector);
    if (!root) return;
    const tabs = Array.from(root.querySelectorAll(buttonSelector));
    const panels = Array.from(root.querySelectorAll(panelSelector));
    const status = root.querySelector(statusSelector);
    const activate = (selected, focus = false) => {
      const value = selected.getAttribute(attr);
      tabs.forEach(tab => {
        const active = tab === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        tab.classList.toggle('is-active', active);
      });
      panels.forEach(panel => { panel.hidden = panel.dataset.productPanel !== value; });
      if (status) status.textContent = selected.textContent.trim() + ' selecionado.';
      if (focus) selected.focus();
      return value;
    };
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => activate(tab));
      tab.addEventListener('keydown', e => {
        let next;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); next.click(); next.focus(); }
      });
    });
    return { root, tabs, activate };
  };
  setupTabs('[data-products-hero]', '[data-hero-product]', '[data-product-panel]', 'data-hero-product', '[data-hero-status]');
  const showcase = setupTabs('[data-products-vitrini]', '[data-vitrini-product]', '[data-product-panel]', 'data-vitrini-product', '[data-vitrini-status]');
  if (showcase) {
    const map = {
      catalogo: {
        title:'Uma oferta organizada em um só lugar.',
        description:'Estruture categorias, descrições e caminhos de contato. Uma vitrine para mostrar o que você oferece sem depender de mensagens repetidas.',
        steps:['Oferta dispersa entre conversas','VITRINI organiza categorias e destaques','O cliente encontra o próximo contato'],
        cta:'Explorar VITRINI ↗',href:'vitrini.html'
      },
      link: {
        title:'Sua marca em uma página compacta.',
        description:'Reúna apresentação, links importantes e um contato principal em uma experiência feita para compartilhar na bio e em campanhas.',
        steps:['Vários canais sem uma entrada clara','VITRINI Link reúne os acessos','Mais clareza para iniciar o contato'],
        cta:'Conhecer VITRINI Link ↗',href:'vitrini-link.html'
      },
      local: {
        title:'Um caminho para ser encontrado na região.',
        description:'VITRINI Local é a proposta de descoberta de negócios próximos, reunindo informações, localização e contato. Consulte a disponibilidade atual.',
        steps:['Negócio com pouca presença regional','VITRINI Local organiza a descoberta','O visitante encontra informações locais'],
        cta:'Perguntar sobre VITRINI Local ↗',href:'contato.html'
      }
    };
    const title = showcase.root.querySelector('[data-vitrini-title]');
    const description = showcase.root.querySelector('[data-vitrini-description]');
    const steps = Array.from(showcase.root.querySelectorAll('[data-vitrini-step]'));
    const link = showcase.root.querySelector('[data-vitrini-link]');
    const syncAnchor = () => { if (window.location.hash === '#vitrini-local') { const local = showcase.tabs.find(tab => tab.dataset.vitriniProduct === 'local'); if (local) { local.click(); requestAnimationFrame(() => document.getElementById('vitrini')?.scrollIntoView({block:'start'})); } } };
    window.addEventListener('hashchange', syncAnchor);
    syncAnchor();
    showcase.tabs.forEach(tab=> tab.addEventListener('click',()=>{
      const data=map[tab.dataset.vitriniProduct];
      if (!data) return;
      title.textContent=data.title;
      description.textContent=data.description;
      steps.forEach((el,i)=>el.textContent=data.steps[i]);
      link.textContent=data.cta;
      link.href=data.href;
    }));
  }
  const lab=document.querySelector('[data-engreni-lab]');
  if (lab) {
    const frame=lab.querySelector('[data-engreni-frame]');
    const switches=Array.from(lab.querySelectorAll('[data-engreni-device]'));
    const deviceStatus=lab.querySelector('[data-device-status]');
    switches.forEach(button=> button.addEventListener('click',()=>{
      const next=button.dataset.engreniDevice;
      frame.dataset.device=next;
      switches.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));
      deviceStatus.textContent='Visualização '+(next==='mobile'?'mobile':'desktop')+' selecionada.';
    }));
    const service=lab.querySelector('[data-demo-service]');
    const time=lab.querySelector('[data-demo-time]');
    const summary=lab.querySelector('[data-demo-summary]');
    const update=()=>{summary.textContent=service.value+' · '+time.value+' (exemplo)';};
    service.addEventListener('change',update);
    time.addEventListener('change',update);
    update();
  }
})();