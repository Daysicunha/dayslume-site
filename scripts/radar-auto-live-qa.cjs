'use strict';
const {downloadForQA}=require('../api/radar-auto.js');
const {scanHtml}=require('../lib/radar-auto-core.cjs');
(async()=>{let failed=false;
for(const url of ['https://dayslume.daysicunha.com.br/','https://local.daysicunha.com.br/']){
 try{const d=await downloadForQA(url);const r=scanHtml(d.html,{robots:d.robots});console.log('RADAR_LIVE '+JSON.stringify({url:d.url,observedAt:new Date().toISOString(),httpStatus:d.status,bytes:d.bytes,...r}));}
 catch(e){failed=true;console.log('RADAR_LIVE_FAILURE '+JSON.stringify({url,error:e.message}));}
}
if(failed)process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1});
