# DAYSLUME 3.3 — Lote D | QA integrado e critérios de homologação

**Data:** 12/11/2026  
**Base analisada:** `948f4939c42aa0ea83b9389287a93fe07669f40b` (continuação dos Lotes A, B e C).  
**PR de referência:** #21, ainda inalterada e em rascunho.  
**Política de deploy:** nenhuma atualização de branch, `main` ou Vercel durante os lotes. Os commits existem como objetos Git isolados.

## Escopo conferido

1. Abertura cinematográfica: cinco cenas, botão PULAR ABERTURA, estado inerte dos textos ainda não visíveis e retorno do menu depois do filme.
2. Navegação: fallback sem JavaScript, cabeçalho em fluxo visual fixo, faixa de ajuda e CTA de WhatsApp sem cobrir a abertura.
3. Transições: efeitos luminosos **somente nos limites das seções**; nenhuma linha extra dentro das cenas.
4. Rodapé: preservado o original; removidos os créditos cinematográficos extras.
5. Animação: quadros sob demanda, uma só camada de parallax da hero, redução de movimento, aba oculta e fallback sem `IntersectionObserver`.
6. Páginas internas: Soluções, Produtos, Projetos, Conteúdos, Sobre e Contato compartilham camada editorial leve sem substituição dos widgets e sem adicionar fontes.
7. Rotas e referências: 20 páginas HTML conferidas por inspeção de fontes em duas rodadas, verificando H1, última folha de estilos oficial, âncoras locais e arquivos de referências relativos ao repositório. Não foram identificadas referências locais inexistentes na árvore examinado.

## Correções de integração do Lote D

- O controlador de seções internas não abandona o registro de mudanças de `prefers-reduced-motion` quando a preferência já está ativa no primeiro carregamento.
- Mantida uma linha estática visível como fallback em navegadores sem `IntersectionObserver`.
- O filme também continua respondendo à rolagem quando `IntersectionObserver` não está disponível.
- O cabeçalho considera a **altura real da faixa de ajuda**, prevenindo sobreposição quando o texto quebra em telas estreitas, incluindo mudança de largura durante a sessão.
- Testes de regressão ampliados e validação comportamental de alternância de movimento.

## Critérios obrigatórios antes de considerar a PR #21 pronta

| Ambiente | Verificação | Status |
|---|---|---|
| Desktop 1440 / 1280 / 1024 px | Cena inicial, iluminação, split VITRINI/ENGRENI, hero 3D sem sobreposição, cartões de cases | **Pendente: navegador** |
| Tablet 768 px | Menu, tipografia, passagem filme → hero, divisórias de seções, cards | **Pendente: navegador** |
| Mobile 390 / 360 / 320 px | Legibilidade, cortes laterais, header/faixa de ajuda, botões e rodapé | **Pendente: navegador** |
| Preferência de movimento reduzido | Filme estático, divisórias legíveis, navegação normal, alternância durante a sessão | **Implementado + teste simulado; pendente: navegador** |
| Teclado e zoom 200% | Pular abertura, Tab/Shift+Tab, foco visível, filtros, tabs, WhatsApp | **Pendente: navegador** |
| Sem JavaScript | Navegação principal, fallback da intro, links e contato direto | **Inspeção estática; pendente: navegador** |
| Performance | CLS/LCP/INP, FPS, fontes, filtros e efeito de blur | **Pendente: Lighthouse/DevTools** |
| Conteúdos e cases | Imagens reais, textos, disponibilidade dos produtos, links externos e formulários | **Pendente: homologação humana** |

## Critérios de aceite do Lote D

- [x] Isolar a implementação e manter `main`, PR #20 e PR #21 sem alteração.
- [x] Corrigir falhas detectadas por revisão técnica e testes simulados.
- [x] Manter a abertura, interfaces 3D, showroom, cases, conteúdos, links e formulário existentes.
- [x] Preservar o rodapé original e iluminar somente as bordas de seção.
- [x] Não acionar deploy adicional.
- [ ] Executar o GitHub Actions completo na branch consolidada e verificar o resultado.
- [ ] Homologar em navegador real, desktop/mobile, acessibilidade e desempenho.
- [ ] Obter aprovação visual da fundadora.
- [ ] Somente depois considerar integração/publicação.

**Nota:** verificações estáticas e simulações de DOM não equivalem a teste real com navegador, leitor de tela nem medições de desempenho. Não declarar aprovação visual ou prontidão para produção antes dessa etapa.
