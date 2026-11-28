'use strict';
const https=require('node:https');
const {Resolver}=require('node:dns').promises;
const {normalizeTarget,publicIPv4,scanHtml}=require('../lib/radar-auto-core.cjs');
const LIMIT=524288, DEADLINE=7000;
let active=false,windowStart=0,attempts=0;
const enabled=()=>process.env.VERCEL_ENV==='preview'&&process.env.RADAR_AUTO_ENABLED==='1';
async function resolvePublic(host,deadline){
 const resolver=new Resolver();
 const timer=setTimeout(()=>resolver.cancel(),Math.max(1,deadline-Date.now()));
 try{const addresses=await resolver.resolve4(host);if(!addresses.length||addresses.some(a=>!publicIPv4(a)))throw Error('DNS não autorizado.');return addresses[0];}
 finally{clearTimeout(timer);}
}
async function download(url,deadline,redirects=0){
 if(Date.now()>=deadline)throw Error('Tempo de consulta excedido.');
 const ip=await resolvePublic(url.hostname,deadline);
 return new Promise((resolve,reject)=>{
  let timer, settled=false;
  const end=(err,value)=>{if(settled)return;settled=true;clearTimeout(timer);err?reject(err):resolve(value);};
  const req=https.request(url,{method:'GET',agent:false,family:4,lookup:(_host,options,cb)=>options?.all?cb(null,[{address:ip,family:4}]):cb(null,ip,4),servername:url.hostname,rejectUnauthorized:true,headers:{'User-Agent':'DAYSLUME-Radar-Pilot/1.0','Accept':'text/html,application/xhtml+xml','Accept-Encoding':'identity'}},res=>{
   const status=res.statusCode||0;
   if([301,302,303,307,308].includes(status)){
    res.destroy();
    try{if(redirects>=1||!res.headers.location)throw Error('Limite de redirecionamento.');const next=normalizeTarget(new URL(res.headers.location,url).href);end(null,{redirect:next});}catch(e){end(e);}return;
   }
   if(status!==200){res.destroy();end(Error('O servidor não retornou HTTP 200.'));return;}
   if(!/^(text\/html|application\/xhtml\+xml)(?:;|$)/i.test(String(res.headers['content-type']||''))||!['','identity'].includes(String(res.headers['content-encoding']||'').toLowerCase())||Number(res.headers['content-length'])>LIMIT){res.destroy();end(Error('Resposta não suportada ou acima do limite.'));return;}
   const chunks=[];let size=0;
   res.on('data',chunk=>{size+=chunk.length;if(size>LIMIT){res.destroy();end(Error('HTML acima do limite.'));return;}chunks.push(chunk);});
   res.on('aborted',()=>end(Error('Resposta interrompida.')));
   res.on('error',()=>end(Error('Falha ao receber HTML.')));
   res.on('end',()=>end(null,{html:Buffer.concat(chunks).toString('utf8'),status,bytes:size,robots:res.headers['x-robots-tag']||''}));
  });
  req.on('error',()=>end(Error('Falha de conexão HTTPS.')));
  timer=setTimeout(()=>{req.destroy();end(Error('Tempo de consulta excedido.'));},Math.max(1,deadline-Date.now()));
  req.end();
 }).then(r=>r.redirect?download(r.redirect,deadline,redirects+1):({...r,url:url.href}));
}
module.exports=async function handler(req,res){
 res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
 if(req.method==='GET')return res.status(200).json({enabled:enabled()});
 if(req.method!=='POST'){res.setHeader('Allow','GET, POST');return res.status(405).json({error:'Método não permitido.'});}
 if(!enabled())return res.status(503).json({error:'Auditoria automática ainda não liberada.'});
 // A flag só pode ser ativada após confirmar proteção do deployment inteiro.
 if(req.headers.origin!=='https://'+req.headers.host||!String(req.headers['content-type']||'').startsWith('application/json'))return res.status(403).json({error:'Origem não permitida.'});
 let target;try{const body=typeof req.body==='string'?JSON.parse(req.body):req.body;target=normalizeTarget(body?.url);}catch(e){return res.status(400).json({error:'Informe a página inicial HTTPS de um domínio autorizado.'});}
 const now=Date.now();if(now-windowStart>=60000){windowStart=now;attempts=0;}
 // Limite adicional por instância, NÃO é cota global distribuída.
 if(active||attempts>=5)return res.status(429).json({error:'Limite temporário de testes atingido.'});
 active=true;attempts++;
 try{const data=await download(target,now+DEADLINE);const report=scanHtml(data.html,{robots:data.robots});return res.status(200).json({...report,url:data.url,observedAt:new Date().toISOString(),httpStatus:data.status,bytes:data.bytes});}
 catch(e){return res.status(422).json({error:'Não foi possível concluir a consulta técnica. Nenhuma nota foi atribuída.'});}
 finally{active=false;}
};

// Export only for the controlled Node homologation script; HTTP handler remains gated.
module.exports.downloadForQA=async input=>download(normalizeTarget(input),Date.now()+DEADLINE);
