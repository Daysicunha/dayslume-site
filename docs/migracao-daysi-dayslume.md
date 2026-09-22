# Migração comercial Daysi Cunha → DAYSLUME
Versão de trabalho · 21/09/2026

## Estado
Migração editorial e implementação em branch separada `feat/migracao-comercial-dayslume` do repositório `Daysicunha/dayslume-site`.
A branch `main` da DAYSLUME e o site pessoal publicado não foram alterados nesta etapa. O objetivo é transferir a **função comercial**, não apagar a autoria dos projetos nem copiar campanhas expiradas.

## Matriz origem e destino

| Origem no site Daysi Cunha | Destino desenvolvido na DAYSLUME | Tratamento |
|---|---|---|
| `servicos.html` e `solucoes.html` | `servicos.html` e `solucoes.html` | Apresentação comercial de serviços e famílias de produtos; textos reescritos para a empresa. |
| `landing-pages.html` | `landing-pages.html` | Página comercial específica, sem limites de escopo e prazo históricos presumidos. |
| `sites-completos.html` | `sites-completos.html` | Página comercial específica, com definição de escopo na proposta. |
| `vitrini.html` | `vitrini.html` | Conteúdo perene do catálogo e do painel, sem reaproveitar a pré-venda antiga de R$ 299 como vigente. |
| `processo.html` | `processo.html` | Método de diagnóstico, planejamento, desenvolvimento, testes e entrega. |
| `cases/tornearia-barbosa.html` | `projetos.html` e `projetos/tornearia-barbosa.html` | Atribuir o desenvolvimento à fundadora. A versão autoral permanece em Daysi Cunha. |
| `contato.html` | `contato.html` | Contato **provisório** direciona explicitamente ao formulário pessoal existente enquanto o canal empresarial não estiver confirmado. A home da DAYSLUME ainda contém formulário demonstrativo. |
| `briefing-vitrini.html` | Não migrado nesta etapa | O formulário de pós-compra está sem integração; requer fluxo autenticado e revisão de dados e privacidade antes de uso empresarial. |
| Artigos e blog | Não migrados nesta etapa | Conteúdos autorais permanecem com Daysi Cunha. Conteúdos comerciais poderão ser reescritos para a DAYSLUME após revisão individual e planejamento de URLs. |

## Decisões preservadas
- DAYSLUME: empresa, estratégia e tecnologia para negócios, com identidade da margarida e lettering aprovados. Não alterar o símbolo nesta migração.
- Daysi Cunha: marca pessoal, portfólio autoral, estudos e trajetória profissional.
- Nenhuma venda, conversão ou efeito de SEO é afirmado sem medição e evidências.
- Não copiar preços, prazos de entrega, políticas de manutenção ou garantias de ofertas históricas como vigentes.
- Não apagar, redirecionar nem alterar URLs do site Daysi Cunha até que a migração seja avaliada e as páginas de destino estejam disponíveis e corretas.

## Arquivos nesta branch
- `index.html`: home ligada às novas páginas comerciais e case.
- `assets/css/institucional.css`: estilo das páginas migradas na paleta da DAYSLUME.
- `servicos.html`, `landing-pages.html`, `sites-completos.html`, `solucoes.html`, `vitrini.html`, `processo.html`, `projetos.html`, `projetos/tornearia-barbosa.html` e `contato.html`.

## Bloqueadores antes de publicar como versão definitiva
1. Aprovar conteúdo, consistência visual e navegação das páginas no desktop e mobile.
2. Confirmar domínio final, canal empresarial, tratamento de dados de contato, informações obrigatórias e política de privacidade compatível.
3. Remover `noindex,nofollow` das páginas migradas **apenas depois** de aprovar sua publicação e definir URLs/canônicas; o bloqueio protege prévias contra indexação.
4. Substituir formulário demonstrativo da home por fluxo real ou por link direto para canal verificado.
5. Validar o escopo vigente do VITRINI e a disponibilidade das soluções ENGRENI antes de apresentar detalhes de contratação.
6. Selecionar capturas reais e autorizações de divulgação; evitar representação de um produto não concluído como entrega comercial pronta.
7. Fazer plano individualizado de redirecionamentos 301 das páginas antigas para as correspondentes quando o conteúdo comercial definitivo estiver publicado. Não redirecionar a página do case autoral nem todo o blog automaticamente.
8. Confirmar se a branch está ligada a um projeto de prévia da Vercel; não supor publicação automática.
