# DAYSLUME 3.3 — Arquitetura editorial e conversão aprovada
Base: 731f5247184173e918ad22d76522f9b8269313a5 (commit preparado após Lote E). Sem nova prévia.
## Decisões da revisão
- Preservar cinco cenas, hero 3D e cards ilustrativos de VITRINI e ENGRENI, três cases publicados e apresentação da fundadora.
- Condensar explicações de problemas, serviços e produtos e reduzir o processo a três momentos dentro da seção da fundadora.
- Retirar a seção extensa de RITMO da home. RITMO continua no catálogo em `solucoes.html#ritmo-produto`, com informação de produto experimental. Retirado o CSS RITMO da home; arquivo original preservado para catálogo.
- Passar a home pela ordem: **abertura → hero → problemas → caminhos → produtos → cases → fundadora e método → dois artigos → contato**.
- Dois artigos na home com chamadas correspondentes aos títulos verdadeiros da publicação, sem eliminar os artigos do blog.
- Hero e seção de cases conduzem diretamente a `#contato`; contato oferece WhatsApp direto. Alterar o rótulo da navegação da home para **Serviços**, distinguindo serviços sob medida de **Produtos**.
- Identificar estágios de produto sem atribuir disponibilidade comercial não verificada.

## Notas de implementação
- Módulo `hero-prism-scroll.js` tolera ausência do antigo `[data-process-scroll]` por guardas de nulo. A seção do RITMO não é necessária a esses scripts.
- Manter `id=processo-home` na nova subseção institucional preserva referências de âncora.
- Manter IDs de seções e os componentes 3D, fotos, cases, formulário, FAQ e rodapé.
- Estilos compactos estão em `assets/css/cinematic-editorial-33.css` antes da paleta canônica.
- Não afirmar homologação visual até conferir títulos grandes, espaçamentos e animações em desktop/mobile.
## Testes e pendências
- Atualizar os testes que pressupõem oito seções editoriais, o bloco de cinco etapas e três cards de artigos.
- Verificar a prévia em navegador e confirmar que a página de Produtos deixa claros os estágios disponíveis.
- Considerar padronização do rótulo **Serviços** nas páginas internas em rodada dedicada para não misturar a reorganização da home com navegação de outros documentos.
