# DAYSLUME 3.3 — mapa visual da Home, 19/11/2026

## Escopo
Versão de homologação, derivada da PR #31, sem merge na main. A mudança aplica o mapa cromático aprovado em **um bloco Home escopado ao final de `assets/css/brand-palette.css`**, preservando a paleta canônica como última folha da página. Na homologação final, reconciliar regras históricas redundantes dentro do mesmo arquivo.

## Sequência de superfícies
0. Introdução cinematográfica: dark ink, rosa neon apenas nas luzes e palavras de destaque (preservada).
1. Hero: plum/ink, simuladores reais e órbita 3D (preservados, halo equilibrado).
2. Problemas: ink mineral, microacento rosa no item ativo.
3. Modelo: marfim editorial (antes malva), título ink, card bespoke em ameixa escuro, products em marfim-pêssego com tipografia ink e respiro vertical menor em mobile.
4. Produtos: ink/ameixa profundo, neon no foco/interação, capturas e geometrias intactas.
5. Projetos: marfim editorial, textos ink, case 02 mantém card dark, órbita lateral de baixa opacidade, imagens originais intactas.
6. Sobre: mantém dark e fotografia sem sobreposição; luz só na moldura.
7. Conteúdos: preserva cards editoriais claros aprovados, harmoniza fundo marfim e interações.
8. Contato: ink cinematográfico, título marfim, destaque neon, roda de encerramento e formulário claro legível.

## Critérios de homologação
- Verificar 320/360/390/768/1024/1440px; tipografia, CTAs, cards e ausência de overflow.
- Confirmar imagens/ilustrações e ordem do DOM intactas.
- Garantir que contraste do card de produtos próprios seja escuro, e que labels do formulário permaneçam escuros no formulário claro.
- Conferir círculo do modelo/projetos/contato, posição dos widgets flutuantes e transição de filmes/atos.
- Contrastar o primeiro card com o fundo marfim no mobile; sem grade horizontal ou sobreposição dos controles.
- A alteração não publica em produção; PR permanece rascunho até aprovação explícita.
