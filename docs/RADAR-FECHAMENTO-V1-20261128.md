# Radar Público — fechamento V1 assistida

## Escopo de liberação
Somente autoavaliação gratuita, recomendações, relatório TXT, contato por WhatsApp com confirmação e origem de campanha declarada, página de apresentação Presença. Nenhum cadastro obrigatório, coleta de métricas automática, auditoria remota de terceiros ou promessa de ranking/vendas. Motor Auto deve permanecer desativado em produção.

## Revisão visual e funcional
- Base d1011193b57674ef2e50a893533314cd738f59ea: QA estático, Radar Auto e visual/funcional aprovados; execução 46167566883 confirmou teste de origem na mensagem.
- Correções seguintes: afbf302bc743045f6bce13bfa7dc1d186a464398 (desktop alinhado ao topo no resultado, introdução móvel compactada); b79dea6f4f18520026e0a720cd9fbe003b5b6516 (foco e rolagem); 17f983a8fd90f61f54469438c07d9a3780ac7584 (teste de alinhamento, reinício e screenshots da área completa). Nova validação requerida antes de publicação.
- Revisar screenshots completos de 320/390/768/1440 px, CTA, leitura, foco, campos, consentimento, reset e exportação. Não confundir screenshot automatizado com aprovação estética.

## Privacidade e revisão comercial
A autoavaliação roda no navegador. Campos opcionais, respostas e origem ficam em memória enquanto a página estiver aberta; o link WhatsApp só é preparado após confirmação e revisão. Não pedir dados de clientes, senhas, tokens ou informações sensíveis. A abertura do link transmite a mensagem ao WhatsApp; o usuário decide enviar. A hospedagem e o WhatsApp podem tratar dados técnicos próprios. A revisão da política de privacidade institucional e das condições de atendimento é obrigatória antes do lançamento. Não afirmar conformidade LGPD sem revisão efetiva.
- Atendimento assistido: confirmar necessidade, escopo e valor antes de iniciar trabalho. Não prometer prazo, resultado ou serviços não contratados.
- Registros de contatos: controle privado autorizado, coleta mínima; distinguir clique de conversa recebida, lead qualificado, proposta e contratação. Não armazenar dados de contatos neste repositório.

## Sequência de publicação (dependente de autorização)
1. Aprovar visual e texto, confirmar WhatsApp oficial.
2. Confirmar CI final e preview READY do PR #34. Preservar versão de produção atual; identificar deployment anterior para rollback. Não promover PR #16 de QA isolado.
3. Após autorização explícita, liberar somente PR #34, verificar a URL real, fluxo sem cadastro, consentimento, links e API desativada. Em regressão, reverter ao deployment anterior conforme estratégia Vercel.
4. Divulgar apenas após smoke test pós-publicação. Monitorar manualmente 14 dias; meta experimental de três conversas qualificadas.
5. Homologar Presença, Marketing Studio e Hub separadamente com sessões QA autorizadas; jamais utilizar senhas/tokens em chat.

Nenhum merge ou publicação efetuado neste fechamento.
