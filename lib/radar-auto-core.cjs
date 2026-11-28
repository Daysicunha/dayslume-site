'use strict';
// Radar Auto V1: HTML estático, sem executar scripts. Não é crawler nem IPD.
const ALLOWED = new Set(['dayslume.daysicunha.com.br','local.daysicunha.com.br']);
function normalizeTarget(input) {
 if(typeof input!=='string'||input.length>250) throw Error('Informe um endereço autorizado.');
 let u;try{u=new URL(input.trim().includes('://')?input.trim():'https://'+input.trim());}catch{throw Error('Endereço inválido.');}
 if(u.protocol!=='https:'||u.username||u.password||u.port||u.search||u.hash||!ALLOWED.has(u.hostname)||!['/','/index.html'].includes(u.pathname))throw Error('Nesta homologação, somente a página inicial HTTPS de um domínio autorizado pode ser analisada.');
 return u;
}
function publicIPv4(ip){
 if(typeof ip!=='string'||!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip))return false;
 const a=ip.split('.').map(Number);if(a.some(v=>v>255))return false;
 const [x,y,z]=a;
 // Conservador: exclui especiais IANA, privados, loopback, documentação e multicast.
 return !(x===0||x===10||x===127||x>=224||(x===100&&y>=64&&y<=127)||(x===169&&y===254)||(x===172&&y>=16&&y<=31)||(x===192&&(y===0||y===168||(y===88&&z===99)))||(x===198&&(y===18||y===19||(y===51&&z===100)))||(x===203&&y===0&&z===113));
}
function attrs(tag){
 const a=Object.create(null);
 const rx=/([a-z_:][a-z0-9_.:-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+))/gi;
 for(const m of tag.matchAll(rx)){const k=m[1].toLowerCase();if(!(k in a))a[k]=m[2]??m[3]??m[4];}
 return a;
}
function scanHtml(html,meta={}){
 // Heurísticas limitadas ao HTML original; não executa JS nem segue links.
 const raw=String(html).slice(0,524288).replace(/<!--[\s\S]*?-->/g,'');
 const scripts=[...raw.matchAll(/<script\b([^>]*?)>([\s\S]*?)<\/script\s*>/gi)];
 const clean=raw.replace(/<!--[\s\S]*?-->/g,'').replace(/<(script|style|template|noscript)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,'');
 const tags=name=>[...clean.matchAll(new RegExp('<'+name+'\\b[^>]*>','gi'))].map(m=>attrs(m[0]));
 const metas=tags('meta'),links=tags('link'),anchors=tags('a'),images=tags('img');
 const metaValues=name=>metas.filter(m=>(m.name||'').toLowerCase()===name).map(m=>m.content||'').filter(Boolean);
 const title=(clean.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i)?.[1]||'').replace(/<[^>]*>/g,'').trim();
 const description=metaValues('description')[0]||'';
 const robots=[...metaValues('robots'),...metaValues('googlebot'),String(meta.robots||'')].filter(Boolean);
 const noindex=robots.some(v=>/(?:^|[\s,:;])(?:noindex|none)(?:$|[\s,;])/i.test(v));
 const canonical=links.filter(l=>(l.rel||'').toLowerCase().split(/\s+/).includes('canonical')).map(l=>l.href||'').filter(Boolean);
 const jsonld=scripts.filter(m=>(attrs(m[1]).type||'').toLowerCase()==='application/ld+json');
 let valid=0,invalid=0;for(const m of jsonld){try{const v=JSON.parse(m[2]);if(v&&typeof v==='object')valid++;else invalid++;}catch{invalid++;}}
 const h1=tags('h1').length,altMissing=images.filter(a=>!Object.prototype.hasOwnProperty.call(a,'alt')).length;
 const hasWhatsApp=anchors.some(a=>/^https:\/\/(?:wa\.me|api\.whatsapp\.com|web\.whatsapp\.com)(?:\/|$)/i.test(a.href||''));
 const contact=anchors.some(a=>/^(?:mailto:|tel:)/i.test(a.href||''));
 const row=(id,label,status,evidence,action)=>({id,label,status,evidence,action});
 const checks=[
 row('title','Título HTML',title?'observed':'review',title?'Título presente ('+title.length+' caracteres).':'Título não localizado no HTML.','Revisar título descritivo e específico.'),
 row('description','Meta description',description?'observed':'review',description?'Descrição presente ('+description.length+' caracteres).':'Descrição não localizada.','Escrever descrição relevante à página.'),
 row('index','Diretivas de indexação',noindex?'review':'observed',noindex?'Diretiva noindex/none detectada.':'Nenhuma diretiva noindex encontrada nesta resposta.','Conferir intenção de indexação e Search Console.'),
 row('canonical','Canonical',canonical.length===1?'observed':'review',canonical.length+' canonical(s) declarado(s).','Conferir canonical e URL de destino.'),
 row('viewport','Viewport mobile',metaValues('viewport').length?'observed':'review',metaValues('viewport').length?'Meta viewport presente.':'Meta viewport não localizada.','Validar viewport e responsividade em navegador.'),
 row('h1','Títulos H1',h1===1?'observed':'review',h1+' elemento(s) H1 no HTML estático.','Revisar hierarquia semântica; múltiplos H1 não são erro automático.'),
 row('schema','JSON-LD',valid>0&&invalid===0?'observed':'review',valid+' bloco(s) JSON válido(s), '+invalid+' inválido(s).','Avaliar dados estruturados adequados; validade JSON não garante elegibilidade.'),
 row('alt','Atributos alt',images.length===0?'unknown':altMissing?'review':'observed',images.length+' imagem(ns); '+altMissing+' sem atributo alt.','Revisar alternativas textuais e imagens decorativas.'),
 row('contact','Canais de contato',hasWhatsApp||contact?'observed':'unknown',hasWhatsApp||contact?'Link direto de WhatsApp, telefone ou e-mail localizado.':'Links diretos não localizados; outros fluxos podem existir.','Testar manualmente o caminho de contato.'),
 row('speed','Desempenho real','unknown','Não medimos Core Web Vitals, renderização nem experiência de campo.','Executar PageSpeed Insights e consultar dados de campo.'),
 row('indexed','Indexação real','unknown','HTML não comprova que a página está indexada.','Consultar Search Console.'),
 ];
 return {methodology:'auto-html-1.0',checks,observedCount:checks.filter(c=>c.status!=='unknown').length,reviewCount:checks.filter(c=>c.status==='review').length,limitations:['Uma página; HTML original; análise heurística de marcação.','Não executa JavaScript, não testa compra, não mede ranking nem presença nas IAs.','Um item observado não significa conformidade completa.']};
}
module.exports={normalizeTarget,publicIPv4,scanHtml};
