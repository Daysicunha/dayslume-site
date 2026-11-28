# Radar Público V1 — autorização de release (28/11/2026)
## Estado técnico
O candidato anterior f74cf05f4a9965945d0e0af1e8909a56298ac593 passou QA estático e Radar Auto, porém falhou o job functional da execução 46167977155 em TypeError de locator.screenshot (API Puppeteer incompatível). Capturas gerais passaram. Corrigido no commit 9e002699d5c6419a1a996f846a8b4c5d6c073d08: ElementHandle.screenshot e consulta page.$; preservados testes funcionais e de alinhamento.
Adicionado aviso contextual de tratamento de dados no commit 668c47e2f279c64e8720aabf8d4f5f08254c2bff; lastmod da página serviços atualizado em fd6950fc164610ee97b8f5b6f91156724d7ce40e. CI final em execução na consulta; não afirmar aprovação final.
## Referência de recuperação
Domínio real https://dayslume.daysicunha.com.br, Vercel projeto dayslume-site, deployment de produção atual dpl_5BgK7HWEocoRAsH62gMtMm31MdRx, URL dayslume-site-il5f2kmlv-daysi-cunha.vercel.app, commit b93dc0ae65d8ad648cf9e467fb43482d4a1b6c19, READY. Confirmar novamente no momento da liberação. Nenhum rollback executado.
## Gate de aprovação
1. CI completo aprovado no head do PR #34, prévia READY e revisão humana das capturas completas. Se testes falharem, manter rascunho e corrigir.
2. Aprovação da responsável quanto à oferta, texto, identidade, contato e tratamento de dados. Aviso contextual não equivale a política institucional completa nem certificação LGPD.
3. Autorização explícita de publicação somente do PR #34. Sem PR #16, PR #23 ou PR #15; sem alteração de Neon e sem ativar Radar Auto.
4. Verificar main atual, conteúdo do diff, checks e referência de rollback. Após merge autorizado, verificar deployment de produção e domínio efetivo. Smoke test: home, serviços, Presença, questionário, resultado, relatório, mensagem sem envio, campanha e GET /api/radar-auto enabled false. Em erro crítico, seguir procedimento de reversão, preservar registros e registrar causa.
5. Somente depois divulgar os links de campanha. Campanha de feed já possui propostas visuais, aprovação editorial e complementos de stories/carrossel não concluídos. Não enviar campanhas automaticamente.
