# DAYSLUME — auditoria visual e de código
Data: 13/10/2026. Revisão baseada na `main` (`ed02f3c`) e nas duas capturas compartilhadas pela titular.
Branch: `fix/auditoria-visual-global-20261013` — PR #15.

## Escopo efetivamente inspecionado

- Árvore de código GitHub: 19 páginas HTML, estilos compartilhados, JavaScript de navegação, animações, formulários e suíte de testes.
- Estado de deployment em Vercel e testes automatizados GitHub Actions.
- Referências visuais fornecidas: primeira dobra desktop da Home e transição de scroll com a flor centralizada.
- **Não** houve inspeção visual automatizada do site aberto: a prévia Vercel protegida não liberou acesso pelo conector/browser. Não há resultado Lighthouse, verificação de links externos ou testes reais de teclado/leitor de tela.

## Falhas e correções

| Achado | Tratamento |
| --- | --- |
| A hero continha definições conflitantes de altura 215/195/185svh em CSS | Unificadas em 168svh; a primeira dobra preserva a composição aprovada |
| A mensagem principal desaparecia cedo, restando uma tela quase vazia com flor central | Texto permanece até 95% da progressão do scroll; painel e flor continuam sincronizados |
| Menu mobile das internas começava em 1000px, diferente dos 1180px da Home | CSS, media query JS e testes alinhados em 1180px |
| Header interno não refletia o estilo de cápsula e a materialidade mineral da Home | Header flutuante editorial com borda sutil, tinta profunda, ameixa mineral e escala responsiva |
| Hero das internas usava decoração circular desconexa da primeira dobra da Home | Paleta mineral bipartida, luz difusa e flor em marca d'água de baixa interferência |
| A quebra de navegação de tablet sem JS poderia deixar conteúdo apertado | Layout de fallback permite menu completo sem JS |
| Diferenças de foco, espaçamento, cards e rodapé entre páginas | Ajustes na camada global `internal-home-parity.css`, sem duplicar HTML |
| Blog e VITRINI Link possuem composições editoriais próprias aprovadas | Preservadas; padronização somente da casca institucional e materiais da marca |

## QA confirmado

- Testes GitHub Actions `QA/static-qa`: **success** no commit `6153c54`, e novamente após o fallback de navegação no commit `f41b4c3`.
- A verificação automatizada abrange H1, metadados, canonicals, sitemap, referências internas, âncoras, links com `target=_blank`, sintaxe de JS e contato.
- Teste adicional garante que as 18 páginas internas importam o sistema compartilhado; regressão de breakpoints e da hero incluída.
- Preview Vercel `READY` para o commit `f41b4c3`.

## Itens que ainda exigem homologação humana / externa

1. Inspecionar o scroll e os quatro tamanhos de tela: desktop 1440px, laptop 1024px, celular 390px e 360px.
2. Confirmar menu, CTAs WhatsApp, formulário, navegação por âncora, links sociais e páginas de produtos em um navegador autenticado.
3. Testar `prefers-reduced-motion`, foco via teclado, contraste efetivo e leituras no mobile.
4. Executar Lighthouse/Core Web Vitals em produção. O repositório mantém vídeo histórico de hero de ~10 MB, mas a hero atual não o referencia: confirmar ausência de transferência na aba Rede antes de eventual remoção do arquivo.
5. Verificar propriedade de Search Console, indexação real, robots de produção e presença nas ferramentas de busca; metadados e `llms.txt` por si sós não garantem citações em IA.
6. Conferir se as URLs declaradas de LinkedIn/TikTok são perfis oficiais ativos; nenhum destino foi inventado ou alterado nesta revisão.

## Política de publicação

Tratar GitHub QA + Vercel READY como comprovação de integridade técnica, **não** como homologação visual. Mudar a `main` só após o escopo pretendido estar documentado e preservando capacidade de rollback.
