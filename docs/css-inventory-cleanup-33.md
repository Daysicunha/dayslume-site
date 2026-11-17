# DAYSLUME 3.3 — Inventário e limpeza segura de CSS
Data: 12/11/2026. Base: b6eefb11fbd03605bbbe27d21ccc9898aae2a86c (Lotes A–D, **não implantado**).

## Evidência de carregamento

O repositório original deste lote tem **43 folhas CSS**. A análise de `<link rel="stylesheet">` nas 20 páginas HTML identificou **36 arquivos CSS distintos carregados diretamente**. Não havia links duplicados dentro da mesma página. Também foi conferido o uso de `@import`: o arquivo `dayslume-components.css` importa `visual-system.css`, e há importações externas de fontes. Nenhum dos sete arquivos legados abaixo é importado por outras folhas.

### Removidos por não serem carregados pelo site
- `benefits-reference.css`
- `contents-reference.css`
- `section-services.css`
- `services-band.css`
- `services-editorial.css`
- `solutions-reference.css`
- `vitrini-link-home-reference.css`

Os sete não são referenciados por páginas, scripts ou testes atuais. Os arquivos permanecem recuperáveis pelo histórico Git, mas são excluídos da árvore de trabalho para não confundir a manutenção futura.

### Removido da carga inicial da Home
- `hero-flower-interactive.css` — apenas seletores `.hero--interactive-flower`, `.flower-scene`, `.flower-petal` e `.flower-glow`, todos ausentes da Home 3D atual. O script correspondente não é carregado. Retirado o link do HTML e excluído o arquivo.

## Estado depois da limpeza
- **35 arquivos CSS** no repositório (43 − 8).
- **35 folhas CSS distintas com referências diretas** nas 20 páginas (36 − 1).
- Home: **20 links CSS**, antes 21.
- Redução aproximada de **8,8 KB de CSS transferível na Home sem compressão**. Os outros sete arquivos já não eram carregados, portanto sua remoção limpa o repositório, não acelera páginas públicas.
- Mantidos `brand-palette.css` como último CSS, `visual-system.css` importado pelas internas, `hero-cinematic.css`, `hero-prism-scroll.css`, outros estilos efetivamente carregados e os arquivos de Lotes A–D.

## Duplicações ainda NÃO eliminadas

Há inúmeros **seletores repetidos** em `brand-palette.css`, `home-premium.css` e `hero-tech.css`. A repetição pode representar variações legítimas de `@media`, estados, ordem da cascata ou regras de correção acumuladas. **Não é correto remover automaticamente somente porque o seletor se repete**. A segunda etapa de deduplicação depende de comparação de propriedades, contexto `@media` e regras finais aplicadas no navegador, com screenshots/responsividade para impedir regressões.

## Validação e publicação

Foram analisados 20 HTML, 43 CSS (carregamento/importação), 22 JS e 22 testes quanto a referências nominais de arquivos legados, com atenção ao stylesheet floral. O teste novo garante referências CSS locais e importações internas válidas e preserva a hero 3D. Não foram executados Lighthouse nem homologação visual do commit final: ele permanecerá isolado, sem atualização da PR #21 ou da Vercel até aprovação para a prévia única.
