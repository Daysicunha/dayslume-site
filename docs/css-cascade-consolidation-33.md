# DAYSLUME 3.3 — Consolidação segura da cascata CSS (Fase 2)
Data: 12/11/2026. Base: `0748f4a0ef810aa028da629f072cec6fa3b7b266`.

## Escopo
Após a primeira fase ter removido oito folhas antigas, foram inspecionados os **35 arquivos CSS restantes**, incluindo referências diretas, `@import` e colisões de seletores.

Em cinco arquivos ativos havia blocos ou declarações repetidas no mesmo seletor e no mesmo contexto de `@media`/outras at-rules. Nesta fase, foram eliminadas somente ocorrências anteriores com **exatamente o mesmo valor de uma declaração posterior**, preservando a última declaração aplicável.

## Alterações reais

| Arquivo | Blocos completamente redundantes removidos | Declarações repetidas eliminadas (inclui blocos completos) | Bytes retirados, não comprimidos |
|---|---:|---:|---:|
| `assets/css/brand-palette.css` | 5 | 35 | 1065 |
| `assets/css/home-premium.css` | 4 | 12 | 296 |
| `assets/css/hero-tech.css` | 6 | 22 | 580 |
| `assets/css/internal-home-parity.css` | 9 | 42 | 1307 |
| `assets/css/hero-cinematic.css` | 2 | 8 | 214 |
| **Total** | **26** | **119** | **3462** |

**Resultado:** permanecem 35 folhas CSS, sem adição ou exclusão de arquivos nesta fase. O ganho em transferência é pequeno e não deve ser apresentado como melhoria medida de velocidade.

## Verificações automáticas de equivalência
- Antes e depois, todas as últimas declarações por **seletor exato, contexto de at-rule e propriedade** foram comparadas: **valores finais idênticos** nos cinco arquivos.
- O inventário manteve todas as consultas `@media` na mesma sequência e a mesma quantidade de comentários.
- Não houve movimentação de regras entre arquivos nem alteração da ordem de links CSS nos documentos.
- Não foi introduzido `@layer`, `@scope`, CSS-in-JS ou mudança de fontes.
- Preservadas as folhas `hero-cinematic.css`, `cinematic-film-intro-33.css` e todos os componentes de interface, os estados de navegação e os dispositivos ilustrativos.

## Mapa de camadas para manutenção
1. **Base:** `home-base.css`, `institucional.css`, `dayslume-components.css`.
2. **Sistema editorial:** `visual-system.css` (importado por `dayslume-components.css`), `home-premium.css`, `internal-home-parity.css`, `editorial-refinement.css`.
3. **Layout por seção/página:** `home-section-rhythm.css`, `products-experience.css`, `projects-experience.css`, `blog-editorial.css`, `about-experience.css`, `contact-flagship.css` e outras folhas especializadas.
4. **Cinema e motion:** `hero-cinematic.css`, `cinematic-experience-33.css`, `cinematic-film-intro-33.css`, `cinematic-editorial-33.css`.
5. **Paleta oficial:** `brand-palette.css`, obrigatoriamente **a última folha** em cada página.

O mapa é **documental**: os links e imports não foram reordenados para evitar mudança de precedência.

## Exigências antes de alterar mais CSS
Seletores iguais com **valores diferentes** podem representar correções de layout, regras de estados e breakpoints necessários. Não foram automaticamente removidos. Uma refatoração mais ampla de `brand-palette.css` ou da hierarquia de fontes deve ser apoiada por screenshots e inspeção de estilo computado nos breakpoints do site.

**Entrega isolada:** este commit não move a PR #21 nem a `main` e não aciona Vercel.
