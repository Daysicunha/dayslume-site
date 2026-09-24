# DAYSLUME — auditoria e refinamento editorial do site
Data: 24/09/2026
Base de verificação: branch main, commit `40bd4b6ed8cae29d9b1de42ab85ecb32224e5fe6`.
Escopo: home, páginas institucionais, portfólio, blog e seus artigos, estilos compartilhados e links locais.

## Referência aprovada e preservação
A hero da home e a seção “O que fazemos” são as referências visuais, não alvos de redesenho. Direção: títulos editoriais legíveis, espaços controlados, cards organizados, CTAs com contraste e foco perceptíveis, detalhes azul/peach discretos, fundo floral e animação apenas onde ela agrega valor.
A camada `assets/css/editorial-refinement.css` é carregada ao final de cada página e utiliza seletores de escopo. Não substitui mídias, imagens de portfólio, textos comerciais, conteúdo dos artigos, links de WhatsApp, lógica do formulário, animações da hero ou o arquivo `section-services.css` aprovado.

## Auditoria inicial do código
- 17 páginas HTML (home, nove páginas institucionais/portfólio, índice do blog e seis artigos).
- 624 referências locais `href`/`src` verificadas contra a árvore Git: nenhum arquivo de destino ausente.
- Nenhuma âncora local ausente, referência vazia, ID duplicado, imagem sem atributo alt, página sem h1 único ou link `target=_blank` sem `rel=noopener` detectados na análise estática.
- Um destino inadequado encontrado na hero de `servicos.html`: “Conhecer os serviços” levava à própria página sem avançar para o conteúdo.
- Links externos, disponibilidade das aplicações apresentadas e o comportamento real do WhatsApp não foram verificados por essa varredura estática.

## Divergências visuais observadas no código
| Área | Diagnóstico | Refinamento |
| --- | --- | --- |
| Home: benefícios | Heading e lista com ritmo diferentes da seção “O que fazemos” | Escala editorial, alinhamento, linhas discretas, respiro e fundo azul-claro |
| Home: soluções próprias | Cards e descrições com proporções variadas | Padding, títulos, conteúdo e foco, preservando as cores distintas de VITRINI/ENGRENI |
| Home: VITRINI em destaque | Seção e composição com dimensão elevada | Redução moderada do padding e ajuste de tipografia/CTA, sem trocar o mockup ilustrativo |
| Home: projetos e conteúdos | Espaçamento e navegação com acabamento desigual | Ritmo de heading, foco nos cards, área de toque e alinhamento de botões |
| Home: sobre e contato | Layout, textos, processo e formulário com medidas diversas | Alinhamento, leitura, superfície e bordas consistentes, sem alterar o fluxo funcional |
| Páginas internas | Aberturas, listas e cards com linguagem visual diferente da hero principal | Hero editorial com fundo e flor discretos; títulos Manrope, cards/etapas/bandas responsivos |
| Blog e artigos | Já possuem identidade editorial própria | Preservada; apenas áreas clicáveis, foco visível e leitura foram revisados |
| Serviços: botão inicial | Link voltava à própria página | Link agora leva a `#o-que-desenvolvemos`, ID aplicado à seção de destino |

## Critérios de regressão
- A home mantém os arquivos originais de hero e “O que fazemos”, e a folha nova não contém seletores que visem essas duas seções.
- Os links dos projetos e CTAs permanecem nos destinos originais, exceto o botão da hero de Serviços, cujo destino interno foi corrigido.
- A cor escura e os contrastes de ENGRENI foram preservados, como também o conteúdo de VITRINI e sua legenda de diagrama conceitual.
- Estilos mobile em 800px e 560px, foco visível e `prefers-reduced-motion` incluídos na camada nova.

## Verificações que ainda dependem do navegador
- Inspecionar desktop e mobile (incluindo 320px/375px, tablet, 1280px+): corte de títulos, contraste sobre o fundo, posição da flor, altura dos cards, formulário, teclas e áreas de toque.
- Verificar visualmente o mockup do VITRINI e os recortes das imagens reais sem modificar enquadramentos autorizados.
- Testar manualmente menu, busca e filtros do blog, filtros de projetos, botões de WhatsApp, validação do formulário e movimento reduzido.
- Conferir links externos e disponibilidade de New Rocket Play, Instagram, TikTok e LinkedIn.
- Antes de indexação pública: confirmar domínio canônico, metadados, sitemap/robots, política de privacidade e remoção planejada do `noindex`. A revisão atual preserva essa marcação.

Este documento registra auditoria do código e alterações propostas. Deploy concluído não equivale à inspeção visual em navegador.
