# DAYSLUME 3.3 — Lote E: refinamento da abertura, menu e copy

## Decisões da homologação visual (prints de 12/11/2026)

- **Menu único**: o cabeçalho global da Home foi reancorado ao topo da janela, largura integral, sem cápsula flutuante, salto, slide ou recuo durante a rolagem. Na abertura, fundo preto; na Home comercial, fundo mineral escuro translúcido. O mesmo cabeçalho mantém os links, CTA e menu mobile.
- **Controles visuais retirados**: remoção dos letreiros “DAYSLUME / FILME INTERATIVO”, “PULAR ABERTURA”, numeração da cena e cronômetro; atalho acessível para pular a abertura continua disponível pelo teclado no início da Home.
- **Hero limpa**: saíram a assinatura floral redundante, texto “interfaces ilustrativas…” no pé dos mockups e o rótulo “01 / abertura…”. Preservados os três mockups tridimensionais e o atalho “Explorar produtos”.
- **Cinco cenas preservadas**: as formas animadas ocupam uma faixa visual mais alta; as legendas foram restringidas a uma área de leitura na parte inferior, com escala responsiva. Recomendada inspeção visual real em desktop 1440/1280, tablet 768 e mobile 390/360/320.
- **Passagem cinematográfica**: um overlay tonal progressivo atua apenas no fim do filme para combinar com o fundo da hero, sem ocultar navegação nem introduzir uma cena adicional. Para movimento reduzido, esse efeito é desabilitado.
- **Copy revisada**: filme apresenta problema, presença, jornada, operação e conversa sem repetir literalmente a headline da hero ou o primeiro card do manifesto. Hero lead ficou mais objetiva; chamada de contato deixou de repetir a pergunta do filme.
- **Dados de demonstração**: removidos valores fictícios R$ 00,00 da UI ilustrativa VITRINI. Substituídos por exemplos claramente identificados como ilustrativos, sem alegar disponibilidade comercial ou preços reais.

## Escopo protegido
Não alterar os cases aprovados, o showroom interativo, os 3D (navegador, celular, cartão), a estrutura dos produtos, o conteúdo de RITMO, as páginas internas, as URLs e o rodapé original. A flor permanece secundária na identidade, mas a assinatura floral adicional marcada no mockup da hero foi retirada.

## Critérios de aceite visual pendentes
- [ ] Header preto e legível em todas as cenas, inclusive menu mobile e foco de teclado
- [ ] Alternância para header mineral escuro sem salto visual, sem flutuação e sem criar segundo menu
- [ ] Cinco cenas no desktop/celular, com textos sem cruzar o plano principal das formas
- [ ] Saída final da cena 5 → hero suave sem corte abrupto
- [ ] Hero preserva profundidade e mockups íntegros; ícone/legendas removidos conforme prints
- [ ] Sem valores fictícios de preço, sem copy repetida, sem rodapé adicional
- [ ] Foco/teclado, movimento reduzido, barra móvel e sobreposição de WhatsApp verificados em navegador
- [ ] Testes completos do GitHub Actions aprovados antes de publicar na main

**Implementação isolada:** esta revisão do Lote E fica registrada como commit Git sem atualizar a PR #21, sem Vercel e sem alteração de produção.
