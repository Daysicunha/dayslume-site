# DAYSLUME 3.3 — Homologação visual e responsiva / Tech × Editorial
_16/11/2026 · Status: QA de código feito; homologação visual em navegador PENDENTE_

## Base auditada
- PR #25: https://github.com/Daysicunha/dayslume-site/pull/25 (rascunho; depende da PR #24, que depende da PR #23).
- Prévia: https://dayslume-site-7nv8j9ptp-daysi-cunha.vercel.app/
- Referência visual aprovada em 13/11: `feat/hero-equilibrio-editorial-20261113`.
- Identidade oficial: `#202532`, `#6B536D`, `#A9C5D8`, `#F3EFE8`, `#66758F`, `#D8B6A5`.

## Evidências verificadas
- Vercel: HTML, CSS de Hero, CSS editorial, scripts e logo principais respondem HTTP 200 na prévia.
- GitHub Actions: 137/137 testes no QA anterior, run #280.
- Os tokens oficiais formam pares texto/fundo com contraste AA mínimo: marfim sobre azul profundo; azul névoa ou pêssego sobre azul profundo; texto azul profundo sobre marfim ou azul névoa; marfim sobre ameixa.
- `index.html` mantém os painéis flutuantes VITRINI, ENGRENI Agenda (sem carcaça de telefone) e serviços, rotator e CTA comercial atual.
- CSS contém estados `prefers-reduced-motion`, breakpoints de celular/tablet e foco visível para o showroom.
- `tests/tech-editorial-responsive-qa.test.cjs` contém testes de regressão para os itens acima.

**Limitação:** não foi possível renderizar capturas reais da prévia nesta sessão. Os resultados são validação de código e de entrega HTTP, NÃO comprovação de geometria, sobreposição, tamanho aparente de fonte, clipping ou ausência de scroll horizontal no navegador.

## Matriz de homologação visual (a concluir antes do merge)

| Contexto | Verificações indispensáveis | Situação |
| --- | --- | --- |
| Mobile compacto · 360×800 | Menu e abertura sem cortar conteúdo; Hero com VITRINI → ENGRENI → serviços sem sobreposição; CTA visível; sem scroll horizontal | PENDENTE — visual |
| Mobile padrão · 390×844 | Legibilidade de produtos, botões do showroom tocáveis, CTA WhatsApp e rodapé sem obstrução | PENDENTE — visual |
| Tablet · 768×1024 | Transição entre layout em uma e duas colunas; sem recorte dos painéis 3D | PENDENTE — visual |
| Desktop · 1440×900 | Hero equilibrada entre texto e painéis; sem interseção indevida; seção escura de produtos com títulos e cartões legíveis | PENDENTE — visual |
| Largura intermediária · 1024×768 | Sem quebra de CTA, corte de legenda, overlap entre browser e agenda | PENDENTE — visual |
| Teclado | Tab e Shift+Tab alcançam links, menu e escolhas VITRINI/ENGRENI; foco visível em fundos claros/escuros | PENDENTE — funcional |
| Preferência por movimento reduzido | Sem animação contínua, com CTA e conteúdo disponíveis | PENDENTE — funcional |
| Sem JavaScript / carregamento parcial | Produtos e links de contato acessíveis; a introdução não prende a navegação | PENDENTE — funcional |

## Critérios de aprovação cromática e editorial
1. Abertura cinematográfica e Hero não são repetidas visualmente no restante da página.
2. O showroom azul profundo marca o segundo momento de tecnologia; cartões VITRINI (claro) e ENGRENI (escuro) permanecem distinguíveis.
3. Projetos usam palco claro e seus três cases reais continuam protagonistas.
4. Fundadora e conteúdo usam superfícies mais humanas, sem padrões decorativos excessivos.
5. O contato termina com ação de alto contraste e não sugere que o formulário desabilitado esteja operacional.
6. Contrastes de texto e controles são validados no navegador; os pares de tokens não substituem o teste da composição final.
7. Nenhum texto novo promocional ou promessa de produto é criado sem revisão.

## Bloqueios de publicação
- Manter PR #25 e dependências em **draft**, sem merge para `main`.
- Confirmar screenshots desktop/mobile reais e registrar eventuais problemas com URL, viewport, seletor e comportamento.
- Corrigir somente problemas reproduzíveis e rodar toda a suíte novamente.
- Exigir aprovação explícita da proprietária para publicar em produção.
