# DAYSLUME Radar Público V1 — 28/11/2026
Branch feat/radar-publico-v1-20261128, base main. Não publicar automaticamente.
## Entrega
- Evolução do diagnóstico existente em servicos.html#diagnostico-digital: oito perguntas, quatro respostas por dimensão, prioridades ponderadas, dados desconhecidos separados, orientação gratuita e exportação TXT.
- Autoavaliação declaratória, NÃO é IPD auditado nem análise automática de URLs. Não há busca externa, crawler, medição de ranking, coleta das IAs ou integração com Neon/CRM. Não inventar diagnóstico. Próxima versão deverá usar backend controlado com proteção SSRF, limites, consentimento e evidências.
- Dados opcionais de negócio/região/site/rede social ficam na memória da página; não gravamos localStorage, cookies ou banco pelo módulo. O relatório TXT não contém esses dados. O visitante pode obter resultados sem identificação. A mensagem só é construída após opt-in, é mostrada para revisão, e o link abre WhatsApp oficial já usado no site. A abertura do link transmite o texto ao WhatsApp; o envio depende do usuário. Não há confirmação de lead ou captura automática de contato.
- Página presenca.html diferencia orientação criativa pontual de serviço gerenciado recorrente. Não apresenta portal como disponível nem preços não aprovados. Home aponta ao diagnóstico e Serviços à assessoria. Sitemap atualizado.
## Verificação
Seis verificações de lógica executadas isoladamente durante a implementação; testes Node adicionados. Executar node --test tests/*.test.cjs e node --check assets/js/radar-public.js. Validar todas as páginas, navegação, acessibilidade, mobile, desktop, voltar/refazer, respostas desconhecidas, exportação, edição após preparar mensagem e consentimento. Revisar texto de privacidade e endereço comercial, testar WhatsApp sem enviar mensagem de teste automaticamente. Verificar regressões de CSS e SEO e revisar no preview antes de merge.
## Pendências
Auditoria automática baseada em evidências externas, captura consentida no CRM/Neon, política de retenção e privacidade, eventos de conversão e integração com Radar interno. A homologação da Presença e de seu portal permanece no PR #16 do marketing studio.
