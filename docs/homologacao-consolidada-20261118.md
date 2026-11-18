# DAYSLUME 3.3 — Consolidação isolada para homologação (18/11/2026)

**Estado:** aguardando homologação visual; não é aprovação para produção.  
**Repositório:** `Daysicunha/dayslume-site`.  
**Branch:** `homolog/dayslume-33-unificada-20261118`.  
**Base integral preservada:** PR #29, head `fa49a350730f85b52c295228353a8ed0ec92b457` de 18/11/2026 13:57 UTC.  
**Refinamentos incorporados:** PR #30, head `35864cd10e30c23340e9452590e877bda82cef87`.

## Reconciliação auditada

1. A `main` permanece em `36d3ea2f3cc4c8ca0f473207ba8be7356033ea8a` no momento da preparação, sem alterações por esta consolidação.
2. Os commits posteriores da PR #29 acrescentaram a Hero com simuladores reais (VITRINI Local, ENGRENI Agenda e Caderneta), iluminação controlada, refinamento da Seção Modelo e Conteúdos editoriais em marfim/ameixa. Preservados integralmente.
3. A PR #30 divergiu da #29 em apenas três arquivos exclusivos: `assets/css/cinematic-editorial-33.css`, `assets/js/home-premium.js` e `tests/surface-motion-20261118.test.cjs`. Seus arquivos equivalem a alterações sobre o ancestral compartilhado `a37532ea1e0060c96b7ce0941bef32ed055b0a43`. Os dois arquivos já existentes na PR #29 têm os mesmos blob SHA do ancestral, portanto a integração é sem conflito de conteúdo.
4. Integram-se os dois arquivos completos da PR #30 **somente** onde a PR #29 não realizou novas edições; acrescenta-se seu arquivo de regressão. Nenhuma folha CSS adicional ou `IntersectionObserver` duplicado foi criado.
5. A abertura de cinco momentos e a transição para a Hero; a Hero e seus simuladores; as seções Problemas, Modelo, Produtos, Projetos, Fundadora, Conteúdos e Contato e as páginas internas vêm da base mais recente da PR #29, sem alteração de seus componentes, imagens ou links nesta integração.
6. Os refinamentos exclusivos incorporados da PR #30 são: reflexos glass decorativos sem interceptação de clique; hover de 3px em Produtos e Projetos; bordas e ícones com token pêssego; escalonamento refinado no observador existente; respeitar `prefers-reduced-motion`; quatro testes de regressão.

## Fontes normativas

- Ameixa mineral `#6B536D` e pêssego `#D8B6A5`, com demais tokens do código. Nada de novo roxo neon/lilás.
- Fontes presentes na Home: Manrope e DM Sans, sem substituição.
- `docs/DOCUMENTO-MESTRE-MARCA-DAYSLUME.md`: discrimina decisões realmente aprovadas das hipóteses ou referências de trabalho.

## Estado por ato — revisão final ainda necessária

| Área | Implementação consolidada | Homologação visual |
|---|---|---|
| Filme de abertura | Preservada da PR #29 | Pendente de reprodução integral |
| Hero | Versão mais recente da PR #29 com simuladores de projetos e iluminação | Pendente desktop/mobile |
| Problemas | PR #29 + reflexo sutil PR #30 | Pendente avaliação de ícones e onda |
| Modelo | PR #29, com refinamentos de 18/11 | Pendente geometria e enquadramento |
| Produtos | PR #29 + glass/hover da PR #30 | Pendente interação |
| Projetos / cases | PR #29 + hover e pêssego da PR #30 | Pendente imagens e bordas |
| Fundadora | Preservada da PR #29 | Pendente fotografia sem interferências |
| Conteúdos | Versão posterior da PR #29, marfim e cenas 3D | Pendente leitura mobile |
| Contato | Preservado da PR #29 | Pendente validar estados e WhatsApp |
| Páginas internas | Preservadas da PR #29 | Pendente navegação e acessibilidade |

## Verificação de qualidade necessária

Os workflows GitHub `QA` e `Visual QA — DAYSLUME` precisam executar na PR de homologação. A pipeline visual gera `dayslume-visual-qa-before-after` e `dayslume-functional-qa`, com screenshots e medições em navegador; baseline atualmente configurado em `7a20572f58503bc6264298646c7c81023025cd95`, portanto não deve ser apresentado como comparação com a produção atual. Capturas só comprovam a versão do SHA identificado na execução. Revisão manual em dispositivo real, foco por teclado, comportamento da abertura, links externos e contraste ainda são obrigatórios.

**Proibição:** não fazer merge na `main`, não promover nem atribuir domínio de produção, nem anunciar aprovação visual sem autorização expressa.

## Ajuste pontual de enquadramento após primeira rodada de capturas

- Inspeção das imagens da primeira execução revelou o painel lateral VITRINI recobrindo texto da agenda em desktop. Corrigida **somente** a distribuição dos três cartões dentro da Hero existente: VITRINI esquerda, Agenda frontal ao centro e Caderneta atrás no alto à direita, preservando ângulos 3D, telas e parallax.
- Corrigidos checks de navegador desatualizados que ainda procuravam seletores da Hero antiga e uma costura ::after removida na PR #29. Ajustada tolerância do pedestal apoiado no limite do card em até 1,5px.
- Capturas após estabilização mais longa (680ms por seção, 1.100ms extra para Hero/Fundadora e 1.350ms para cena final); alertas reais do QA visual agora falham o job.
- Esta intervenção requer **nova prévia** correspondente ao novo head e reexecução do QA, sem afetar a main/produção.
