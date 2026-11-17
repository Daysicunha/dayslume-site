# DAYSLUME 3.3 — Correção geométrica e de cascata | 17/11/2026

Base auditada: `36d3ea2f3cc4c8ca0f473207ba8be7356033ea8a` (PR #28). Branch: `fix/dayslume-idv-visual-cascade-20261117`.

**Status:** intervenção isolada; sem merge para `main`, sem publicação de produção e sem homologação visual presumida.

## Diagnóstico e mudanças na origem

| Superfície | Causa encontrada no código | Intervenção |
|---|---|---|
| Última cena do filme | Última legenda cruza placas VITRINI/ENGRENI | Ocultação de placas somente quando o controlador entra no ato `contato` |
| Notebook Presença Digital | SVG com coordenadas e viewBox folgados | Novo viewBox e círculo interno ajustado; respiro no contêiner |
| Notebook sob medida | `width:155%` com clipping e overrides na paleta | ViewBox expandido para acomodar clipboard/laptop/código e largura limitada ao palco |
| Telas VITRINI/ENGRENI | Teclados representados por `.solution-graphic::after`, independentemente da transformação das telas | Pseudo-elementos das próprias telas, com proporções, perspectiva e animações compartilhadas |
| Dayane Nails | Mídia original 1600×900 em janela de proporção 2.13, com `contain` criando faixas | Moldura 16:9 e apresentação da imagem em toda a área |
| Paleta | `brand-palette.css` misturava tokens com patches de geometria | Tokens preservados; patches retirados; geometria resolvida na folha editorial |
| Tipografia | Montserrat ainda carregada em `institucional.css` | Manrope nos títulos e DM Sans no corpo, conforme auditoria PR #27 |

## Preservado
- Seis tokens documentados e a exceção serifada da Hero.
- Abertura de cinco cenas, seus textos e CTA.
- Composição HTML/CSS da Hero 3D, links, roteamento e navegação.
- Cards, interfaces de produtos, imagem original da Dayane, cases e seus links.
- Fotografia da fundadora sem flor sobreposta, assinatura e contato.
- Animações por viewport e `prefers-reduced-motion`.

## Homologação obrigatória
- Capturas antes/depois em **1440, 1024, 768, 390, 360 e 320px**.
- Verificar último ato do filme ao entrar/sair do estado `contato`.
- Examinar teclados VITRINI/ENGRENI durante animação e hover; nenhuma base pode atravessar a tela.
- SVGs integralmente visíveis; Dayane sem faixas e sem crop dos dispositivos.
- Testar teclado, foco, navegação, contraste, zoom, overflow horizontal e reduced motion.
- Revisar fundos e títulos de todos os atos em navegador.
- Homologação humana **antes de qualquer merge**. QA estático não comprova geometria visual.

## Pendências
As regras secundárias antigas de cor ainda devem ser inventariadas e inspecionadas no navegador. Não se deve converter toda cor de ilustração em token sem antes distinguir material gráfico de superfície institucional.

## Harmonização cromática posterior
Na mesma branch, os fundos principais dos atos **Problemas, Modelo, Produtos, Projetos, Fundadora e Contato**, assim como a iluminação-base da Hero, foram normalizados na origem, substituindo gradientes HEX não normativos por `color-mix()` e canais RGBA derivados dos seis tokens da DAYSLUME. A distinção entre seções claras e escuras e a estrutura 3D permanecem preservadas. A seção Conteúdos já utilizava tokens estruturais. Elementos internos de ilustração e cores dos cases reais não foram recoloridos indiscriminadamente.

## Refinamento cromático de saturação (solicitação da fundadora — 17/11/2026)
A fundadora questionou o lilás/roxo predominante. O documento-mestre de setembro registra **paleta de trabalho azul profundo, off-white, azul suave, azul acinzentado e areia rosada**, sem lilás; o QA de 16/11 documenta **Plum Mineral** como apoio, sem homologação normativa do kit final. O código evoluiu para neons externos à referência, incluindo `#C597D2`, `#9955AC` e ondas violetas.

Nesta PR foram normalizados os **acentos roxo-lilás de alta saturação**, exclusivamente na Home: superfícies e microcomponentes de `cinematic-editorial-33.css`, `contents-cinematic-33.css`, `cinematic-floating-panels-20261113.css` e cores decorativas dos SVGs inline em `index.html`. A transformação conserva os efeitos e as geometrias mas transfere a luminosidade para **Mist Blue, Slate Mineral, Warm Ivory, Peach e Ink Deep**, com misturas sem HEX novos. O plum `#6B536D` fica reservado à assinatura discreta. Valores de estado de erro `#B04560` e `#8E3654` permanecem reconhecíveis.

Contagem da intervenção por arquivo:
- `assets/css/cinematic-editorial-33.css`: 85 HEX substituídos, 104 efeitos RGBA ajustados
- `assets/css/contents-cinematic-33.css`: 41 HEX substituídos, 33 efeitos RGBA ajustados
- `assets/css/cinematic-floating-panels-20261113.css`: 1 HEX substituídos, 35 efeitos RGBA ajustados
- `index.html`: 86 HEX substituídos, 0 efeitos RGBA ajustados

### Escopo e riscos
- Fotografias originais e capturas reais de projetos **não** foram alteradas.
- Nuances da cor corporativa do próprio cliente preservadas nos arquivos de imagem.
- A decisão estética final da paleta deve ser validada pela fundadora em capturas de antes/depois; não se está afirmando que os novos efeitos são um kit oficial assinado.
- Verificar contraste dos links nos cards claros, CTA no escuro, ondas e ilustrações em 320/390/768/1440 px.

### Segunda passagem seletiva
Após comparar capturas reais de 1440 px, permaneceram lilases de baixa saturação nas superfícies (tons rosa não detectados pela primeira varredura por matiz). Foram ajustados na origem os títulos de Problemas, cards Problemas/Modelo/Produtos/Cases, CTA de Fundadora, botões de Conteúdos, formulário de Contato e aba lateral WhatsApp. As três ondas SVG (Fundadora, Conteúdos, Contato) agora usam cores da paleta documentada, preservando forma e animação. Nenhuma camada CSS extra foi acrescentada.

## Refinamento cromático v3 — ameixa e pontos iluminados, 17/11/2026

Decisão solicitada: **aumentar a presença de ameixa (mantendo #6B536D) e recuperar a iluminação cinematográfica localizada, sem voltar ao roxo neon/lilás saturado.**

Mudanças diretamente nas regras existentes, sem folha nova, classe ou componente sobreposto:
- **Hero:** halo ameixa mais presente ao redor das interfaces, reflexo perolado/pêssego no chão e filete de luz no mockup real.
- **Produtos:** dois focos difusos ao redor da composição, ring light pêssego/azul, cards VITRINI com um leve ameixa na borda final e ENGRENI com profundidade mineral.
- **Fundadora:** fundo ameixa mais perceptível nas bordas da cena, iluminação da moldura em volta (nunca sobre o retrato), ícones e CTA com brilho discreto.
- **Contato:** dois pontos de iluminação no fundo, borda e vidro com ameixa desaturado, campo focado com outline visível e botão gradiente plum/ink.
- **Preservados:** cores HEX documentadas da marca, fotos/cases reais, conteúdos, animações, geometrias e menu.

**Comparação controlada:** baseline v2 `adc0ee3253d1c68c606ef88da0ea26e00cf2de46` contra head v3 via `Visual QA`. O estudo comparativo não toma a `main` como 'antes' porque o objetivo desta etapa é avaliar só o ajuste pedido de ameixa e luz.

**Critérios de aceite:** capturas 1440, 390 e 320 px, sem overflow horizontal, texto legível e sem glow sobre fotografia; execução funcional e QA estático. PR permanece rascunho e sem promoção em produção.
