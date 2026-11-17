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
