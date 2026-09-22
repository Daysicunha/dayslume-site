# DAYSLUME — auditoria e primeira entrega premium

> Registro histórico da primeira entrega. Para o estado atual, consulte [a revisão de conclusão](auditoria-revisao-final.md).

Data: 22/09/2026. Escopo: consolidação das branches e refinamento da home para aprovação. O acabamento das páginas internas é a próxima etapa, após avaliação da home.

## Branches comparadas

| Branch | Commit auditado | Estado |
|---|---|---|
| `main` | `6d8ef529061d5a7b66b98d45ffab90bc58396dcb` | Base original: `index.html` e `README.md`. Não alterada. |
| `feat/migracao-comercial-dayslume` | `6a1dc2eec8c183f6e3c555acb9d86709f35b3714` | Base mais completa: 13 páginas HTML, dois artigos, case Tornearia Barbosa, logos e favicon oficiais. |
| `feat/animacoes-hero-dayslume` | `c2033ee72da42e050a6534360f7c6f1f6969f459` | Tem os efeitos ambientais e a faixa contínua, mas não tem as últimas atualizações de logo e WhatsApp da migração. |
| `feat/finalizacao-premium-dayslume` | Nova branch | Consolidada sobre a migração, com a implementação de movimento adaptada da branch de animações. |

Durante esta execução, a `main` recebeu externamente o commit `c329437892ffe31e2686524dd702eb3a93c92939`, adicionando somente `docs/DOCUMENTO-MESTRE-MARCA-DAYSLUME.md`. Esse documento foi lido e incorporado integralmente à branch premium, sem alterar a `main`.

A comparação entre migração e animações identificou divergências em 17 arquivos. Substituir a migração pela branch de animações removeria três arquivos de marca e reverteria os cabeçalhos mais recentes. A resolução preserva integralmente a árvore da migração, aplica os movimentos necessários e registra ambas as branches como ancestrais do commit de consolidação. As branches anteriores permanecem disponíveis.

## Inventário das páginas

| Página | Já existe | Próxima etapa |
|---|---|---|
| Início | Conteúdo, serviços, famílias de produtos, portfólio, blog, apresentação, contato | Home refinada nesta entrega; aprovação visual e validação no navegador. |
| Serviços | Apresentação dos três caminhos e processo | Aplicar componentes aprovados. |
| Landing Pages | Oferta e escopo | Aplicar componentes aprovados. |
| Sites Completos | Oferta e escopo | Aplicar componentes aprovados. |
| Soluções | VITRINI e ENGRENI separados | Validar disponibilidade comercial e imagens dos produtos. |
| VITRINI | Catálogo, painel e contato | Capturas reais do catálogo e painel. |
| Processo | Diagnóstico, planejamento, desenvolvimento, testes e entrega | Uniformizar navegação e acabamento. |
| Projetos | Case Tornearia Barbosa | Ampliar os cases com evidências e imagens autorizadas. |
| Case Tornearia Barbosa | Texto, arte original, autoria e link público | Preservado sem alterações. |
| Conteúdos/Blog | Índice e dois artigos adaptados | Acabamento e estratégia de indexação após aprovação. |
| Contato | Página provisória com link ao site pessoal e WhatsApp | Substituir o atendimento provisório na próxima etapa. |

Os artigos `presenca-digital-estrategica.html` e `depender-apenas-do-instagram-riscos.html` permanecem completos e sem alterações. Nenhuma página do site pessoal foi editada, excluída ou redirecionada.

## Achados e correções da home

- Dois botões flutuantes de WhatsApp se sobrepunham. Agora há um só, com nome acessível e foco visível.
- O formulário apenas mostrava uma mensagem de demonstração. Agora valida os dados, monta a solicitação localmente e oferece a abertura no número **+55 31 99449-2474**, já presente no repositório e fornecido pela titular. Não há envio automático, backend de e-mail nem declaração falsa de entrega; o visitante revisa e confirma no WhatsApp.
- Instagram e LinkedIn eram ícones sem links. Foram retirados da home até existirem URLs empresariais confirmadas; o espaço anterior ao CTA contém somente o WhatsApp verificado. Isso verifica a origem do número, não a entrega de mensagens ou sua disponibilidade na plataforma.
- HTML original: 1.341.428 bytes, com a mesma imagem PNG embutida mais de uma vez. As imagens e estilos passam a arquivos próprios e reutilizáveis. O arquivo original continua no histórico Git. Não houve mudança de framework nem instalação de dependências no projeto.
- Hero: composição, escala tipográfica e espaçamento refinados; título e parágrafo comercial preservados. A alternância usa **IDEIAS / SISTEMAS / EXPERIÊNCIAS**, termos existentes na composição anterior. O título de posicionamento não alterna promessas diferentes.
- A flor em contorno recuperada do material oficial substitui a imagem antiga de pétalas preenchidas na composição da home. O lettering, a assinatura e os arquivos SVG aprovados do repositório não foram redesenhados.
- Fundo ambiental e faixa contínua aproveitam a lógica da branch de animações. Há pausa explícita, pausa quando a aba fica oculta e suporte a `prefers-reduced-motion`. Conteúdo não depende de animação para ficar visível.
- Menu móvel com Escape, retorno de foco, limite de altura e ciclo de foco quando aberto. Menu desktop centralizado e atendimento antes do CTA.
- Famílias VITRINI e ENGRENI conservadas como produtos próprios, separadas dos serviços personalizados; links dos cards e do processo passam a funcionar.
- Portfólio: arte Tornearia Barbosa preservada, captura real New Rocket Play inserida. ENGRENI Agenda mantém apresentação tipográfica, sem ser apresentada como screenshot.
- Rodapé inclui todas as páginas comerciais já existentes. Cores e fontes derivam do projeto existente.

## Imagens e procedência

| Arquivo | Origem e uso |
|---|---|
| `tornearia-barbosa-case.webp` / `tornearia-barbosa-og.jpg` | Originais do repositório de migração, inalterados. A primeira é uma arte de apresentação com interface em notebook, não uma captura direta do navegador. |
| `new-rocket-play-home.webp` | Derivado otimizado do print enviado pela titular (`e1daad49-1f72-442e-ab95-b910c2a1835b.png`). Sem conteúdo inventado. |
| `dayslume-flor-oficial.webp` | Derivado otimizado do símbolo em contorno enviado (`979c3b48-13e0-4f49-9347-815bb95d11f5.png`). |
| `dayslume-logo-horizontal-branca.svg` | Arquivo oficial já presente na migração; usado na home sem modificar os traçados. |
| `tornearia-barbosa-logo.webp` | Logo da própria página pública `https://tornearia-barbosa.vercel.app/assets/img/logotorneariabarbosa.png`. |
| `new-rocket-play-logo.webp` | Logo da própria página pública `https://new-rocket-play.vercel.app/assets/img/IMG_1661.PNG`. |

A faixa reúne apenas os dois projetos explicitamente autorizados no briefing, identificados como projetos selecionados. Não sugere parcerias comerciais com terceiros. As versões originais recebidas continuam preservadas nos arquivos enviados pela titular. Os novos WebP são exportações de desempenho, não imagens geradas.

## Arquivos e confirmações que faltam

1. Capturas autorizadas do VITRINI: catálogo público e painel sem dados de clientes.
2. Capturas autorizadas do ENGRENI Agenda: agendamento público e painel sem dados pessoais; confirmação do que está efetivamente disponível.
3. URLs oficiais de Instagram e LinkedIn da DAYSLUME, se forem entrar no header.
4. Eventual print direto da Tornearia Barbosa escolhido para substituir a arte de apresentação; a arte atual foi preservada.
5. Domínio final, URLs canônicas e imagem social institucional antes da publicação definitiva. Atualmente todas as 13 páginas usam `noindex`; não há sitemap, robots.txt ou canônicas de produção.
6. Aprovação da home para levar o mesmo sistema visual às 12 páginas internas; elas continuam com o acabamento da migração, incluindo seus avisos provisórios.

## Copy — sugestões separadas, não aplicadas

- Após aprovar o visual, revisar a explicação comercial de VITRINI e ENGRENI nas páginas internas com as regras: “apresenta, organiza e gera contato” / “opera e executa processos”.
- Substituir avisos internos de configuração nas páginas secundárias por informações comerciais definitivas quando os canais forem aprovados.
- Detalhar contexto, escopo e entregas reais de cada case, sem métricas, depoimentos ou funcionalidades presumidas.

Os textos comerciais da home foram preservados. Só foram corrigidos estados de formulário, avisos de imagens pendentes, identificação da marca, rótulos de acessibilidade e numeração repetida das seções.

## Validação desta etapa

- Auditoria estática de 13 páginas: links locais e âncoras existentes, um H1 por página e ausência de IDs duplicados.
- `node --check assets/js/home-premium.js`: sintaxe válida.
- Comparação dos textos comerciais da home com a migração; diferenças limitadas às exceções descritas acima.
- Arquivos preexistentes de marca, case e páginas internas preservados.
- Nenhuma mensagem de teste enviada ao WhatsApp e nenhuma coleta de dados adicionada.
- A prévia da migração exige autenticação Vercel. A conexão Vercel disponível não concedeu URL temporária para esse projeto. A confirmação visual/funcional no navegador da nova prévia será registrada no relatório de entrega quando o acesso estiver disponível; verificações estáticas não substituem essa etapa.

Não publicar em produção antes da aprovação visual e da conclusão das verificações pendentes.

## Deploy da primeira entrega

Commit `4b95a9307a0c31098cfe27f082647a46968d33cd`: GitHub/Vercel confirmou **Ready** em 22/09/2026. PR em rascunho: https://github.com/Daysicunha/dayslume-site/pull/2. Prévia: https://dayslume-site-git-feat-finalizacao-premium-dayslume-daysi-cunha.vercel.app. O endereço exige autenticação Vercel; a validação visual permanece pendente até acesso autenticado.
