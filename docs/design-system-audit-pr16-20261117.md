# DAYSLUME · Auditoria de IDV e Design System 3.4

**Data:** 17 de novembro de 2026  
**Repositório:** `Daysicunha/dayslume-site`  
**Origem das mudanças analisadas:** PR #16 — central de ajuda, atendimento e revisão de páginas, concluída em outubro de 2026.  
**Base contemporânea preservada:** `design/dayslume-33-tech-editorial-home-20261116` (PR #25, em revisão).  
**Estado:** padronização de código implementada em branch filha; aprovação visual pendente. Não mesclada à `main`.

## 1. Diagnóstico comprovado por código

| Tema | Evidência | Risco | Correção nesta etapa |
| --- | --- | --- | --- |
| Fontes | `institucional.css` importava Montserrat + DM Sans; `internal-home-parity.css` importava Manrope + DM Sans | Carregamento duplicado e diferenças tipográficas no fallback | `institucional.css` carrega Manrope + DM Sans; segundo import removido; títulos internos em Manrope, corpo em DM Sans |
| Paleta | Valores hex das seis cores oficiais repetidos em cinco CSS de experiências/paridade | Divergência futura ao ajustar a IDV | 171 ocorrências substituídas pelos tokens semânticos existentes |
| Contraste | Slate `#66758F` sobre marfim `#F3EFE8` ≈ 4,07:1 | Insuficiente para texto regular segundo WCAG AA | Token de texto secundário `#536076` ≈ 5,55:1 sobre marfim; aplicado em textos de apoio externos aos mockups |
| Microtipografia | Marcadores narrativos externos às interfaces com 10–11px | Baixa legibilidade | Escala mínima de 12px para os marcadores selecionados |
| Controles | Tabs e seletores de Produtos/Projetos/Sobre com alturas mínimas entre 37–43px | Área de acionamento apertada em dispositivos de toque | Altura mínima comum de 44px e foco visível |
| Cascata | Home com 21 estilos, páginas internas principais com 9–12; `brand-palette.css` contém muitas substituições históricas | Risco elevado ao alterar regras de layout de forma ampla | Mudanças incrementais, sem apagar camadas antigas nesta etapa |

## 2. Identidade visual canônica — manter

| Papel | Token | Cor |
| --- | --- | --- |
| Tecnologia e estrutura | `--ink-deep` | `#202532` |
| Assinatura autoral | `--plum-mineral` | `#6B536D` |
| Pontos de interface e iluminação | `--mist-blue` | `#A9C5D8` |
| Espaço editorial e leitura | `--warm-ivory` | `#F3EFE8` |
| Apoio cromático, grades e contornos | `--slate-mineral` | `#66758F` |
| Calor humano e destaques | `--peach` | `#D8B6A5` |

**Regra:** fundos claros não devem tornar o site excessivamente bege; as interfaces digitais e os produtos devem manter protagonismo. A Ameixa é assinatura, não uma camada roxa contínua. A cor Slate original permanece na IDV, mas não deve ser usada para texto pequeno sobre marfim sem ajuste de contraste.

**Token de texto específico:** `--ds-text-muted-on-light: #536076` (não substitui `--slate-mineral`).

## 3. Tipografia

- **Manrope:** títulos, componentes de interface e legendas de UI.
- **DM Sans:** parágrafos, leitura longa, microcopy comercial.
- **Logotipo:** sempre preservar o arquivo oficial; nenhuma fonte web deve substituí-lo.
- **Escala registrada:** `--ds-type-display`, `--ds-type-section`, `--ds-type-card`, `--ds-type-body`, `--ds-type-label`, `--ds-type-control`. Evitar mudar o tamanho da Hero 3D já aprovada por efeito colateral.
- **Peso/editorial:** títulos preferencialmente 400–600; botões e marcadores 600–750; evitar caixa alta extensa em descrições.
- **Entrelinhas:** `--ds-leading-heading: 1.1` e `--ds-leading-body: 1.68` como referência, respeitando componentes que têm necessidades próprias.
- **Marcadores:** ao menos 12px nas legendas narrativas, mantendo microtextos ilustrativos dos mockups fora da regra.

## 4. Componentes

- Botões e seletores funcionais: mínimo de 44px de altura com foco visível.
- Estados selecionados: preservar `aria-selected`/`aria-pressed`; nunca representar um filtro apenas pela cor.
- Cartões: superfícies claras de referência e tecnologia escura como contraste, evitando sombras e glows neon exagerados.
- Ações comerciais: contraste real e destino íntegro; nenhum CTA fictício.
- Aparência das interfaces VITRINI e ENGRENI: não aplicar tipografia ou tamanhos globais às microtelas ilustrativas.
- Preferência por movimento reduzido: sem transições desnecessárias em seletores.

## 5. Cobertura e limites

**Automação adicionada:** `tests/design-system-audit-pr16.test.cjs` verifica 20 páginas, fontes, cores oficiais, tokens, áreas de toque e contraste.

**Páginas-base verificadas:** Home, Serviços, Produtos, Projetos, Conteúdos, Sobre, Contato, Central de Ajuda, Processo, Sites Completos, Landing Pages, VITRINI e VITRINI Link, case e artigos.

**Preservado explicitamente:**
- Abertura cinematográfica de cinco cenas e Hero 3D com painéis flutuantes.
- Identidade da flor, logotipo, textos, menus, links, navegação e demonstrações interativas.
- Ajustes editoriais já feitos em `#problemas` (ainda sem aprovação visual final).
- `brand-palette.css` como última folha, bem como `main` e produção intactas.

**Ainda não aprovado/validado visualmente:** screenshots reais a 360, 390, 768, 1024 e 1440px, tipografia renderizada com fontes efetivamente carregadas, foco por teclado, layout de menus e showroom nos dispositivos, transição das seções e consistência de fundos em todas as 20 páginas.

## 6. Trabalho posterior, separado da homologação

1. Inspeção em navegador desktop e mobile, com captura de regressões e revisão de legibilidade.
2. Resolver o Ato II em conjunto com a usuária antes de evoluir para o Ato III.
3. Consolidar as regras redundantes das 21 folhas da Home gradualmente, com testes visuais por lote e rollback simples.
4. Adotar estes tokens e escalas como base de novas páginas do **site institucional**, sem aplicar automaticamente o mesmo Design System aos sistemas internos ou comerciais, que possuem escopos próprios.

> Nenhuma mudança desta auditoria é autorização para mesclar a PR #25, modificar a PR #16 fechada ou publicar em produção.
