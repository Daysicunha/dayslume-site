# DAYSLUME — Hero / Síntese Autoral 2.0

**Decisão criativa expressa da fundadora:** apresentação C — margarida em interface translúcida.  
**Escopo:** composição da hero na branch `feat/finalizacao-premium-dayslume`; não altera `main` ou produção.  
**Fonte de alinhamento:** Documento Mestre de Construção da Marca DAYSLUME, versão 1.0, de 22/09/2026.

## Composição aplicada

- Coluna editorial à esquerda: título, texto comercial, texto rotativo e CTAs mantidos, sem trocar a mensagem aprovada "Estratégia e tecnologia para negócios".
- Coluna visual à direita: uma única moldura translúcida com a margarida atual, geometria técnica discreta, glow suave e linha horizontal "ESTRATÉGIA / CRIAÇÃO / TECNOLOGIA" como **detalhe gráfico**, nunca como nova assinatura institucional.
- A antiga dupla de microcards flutuantes e as órbitas grandes foram retiradas, reduzindo elementos concorrentes.
- O movimento é lento, decorativo e dispensável; a preferencia `prefers-reduced-motion` e o controle de pausa da home continuam aplicáveis.
- Mobile: mensagem e ações primeiro, moldura abaixo; nenhuma legenda cobre pétalas ou controles.

## Identidade e pendências de conferência

- A imagem preservada é `assets/images/dayslume-flor-a-partir-do-anexo.svg`, **vetorização de imagem enviada na conversa** e já utilizada na prévia anterior. Seu traçado e cores **não foram redesenhados nesta iteração**.
- O Documento Mestre exige fidelidade ao vetor-mestre oficial. O vetor-mestre e suas exportações ainda precisam ser comparados com esta vetorização antes de aprovar a aplicação para produção. Não qualificar esta cópia como certificada ou substituir silenciosamente por margarida genérica.
- `#22283C`, `#F2F0EB`, `#9BB8CE`, `#6E7F9B` e `#D8B6A5` permanecem referências de trabalho do site até conferência do kit oficial.
- A fotografia da fundadora permanece reservada à seção Sobre, pendente do arquivo final.
- A mídia floral da hero é um SVG estático com animação CSS; **não há vídeo/GIF com quadros reproduzidos** no repositório nesta implementação.

## Aceitação antes de promover a branch

1. Comparar desktop (1366 e 1440 px), tablet (768 px) e mobile (360 e 390 px): hierarquia, enquadramento, ausência de sobreposição e contraste.
2. Verificar botão de contato, link do portfólio, texto rotativo e controle de pausa.
3. Testar `prefers-reduced-motion: reduce`, navegação por teclado e carregamento da imagem.
4. Confirmar os ativos de marca com a fundadora. A implantação na Vercel é **prévia**, não aprovação ou publicação final.
