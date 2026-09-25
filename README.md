# DAYSLUME — finalização premium (prévia)

Branch `feat/finalizacao-premium-dayslume`: continuação do projeto HTML/CSS/JavaScript existente.

- [Documento Mestre da Marca](docs/DOCUMENTO-MESTRE-MARCA-DAYSLUME.md)
- [Auditoria atual e pendências de conclusão](docs/auditoria-revisao-final.md)
- [Auditoria inicial e consolidação](docs/auditoria-finalizacao-premium.md)
- [Roteiro de conferência da home](docs/validar-home.md)
- [Histórico da migração comercial](docs/migracao-daysi-dayslume.md)

A hero mantém a composição Síntese Autoral 2.0. As 13 páginas compartilham navegação e controles de movimento; home e Contato preparam solicitações por WhatsApp. Os dois artigos, a identidade e as imagens foram preservados. Produção e site pessoal permanecem intactos. A conferência visual da prévia protegida e os materiais reais dos produtos ainda estão pendentes.

Prévia local: `python -m http.server 8000`. Validação: `python scripts/check-site.py` e `node --test tests/contact.test.cjs`; sintaxe: `node --check assets/js/home-premium.js`. Não há etapa de build nem dependências adicionais.

---

## Registro histórico da primeira versão

O conteúdo abaixo descreve a prévia original; o estado atual é o relatório de auditoria acima.

# DAYSLUME — site institucional (prévia v1)

Site responsivo em HTML, CSS e JS, pronto para visualização local (abra `index.html`) ou publicação como site estático.

## O que já está implementado
- Identidade de trabalho DAYSLUME, usando o símbolo floral aprovado em conversa anterior.
- Home com hero, serviços, proposta de valor, soluções, portfólio, apresentação e contato.
- Menu mobile, navegação por âncoras, informações sem promessas não verificadas e estados responsivos.

## Antes de publicar como site oficial
1. Substituir o wordmark de texto pelo logo oficial **DAYSLUME** em alta qualidade, assim que os arquivos corretos estiverem disponíveis. O PNG anterior D**AIS**LUME não foi utilizado como logotipo, pois contém a grafia antiga.
2. Inserir capturas reais autorizadas em `/projetos` e substituir os cards marcados como IMAGEM PENDENTE.
3. Confirmar e configurar o canal oficial de atendimento, a integração do formulário e a política de privacidade. O botão de formulário nesta prévia NÃO transmite dados.
4. Confirmar quais produtos estão disponíveis e inserir links corretos, validando o endereço institucional e o nome antes de divulgação pública.
5. Realizar testes completos de acessibilidade e desempenho na infraestrutura real de publicação.

## Capturas solicitadas
- Tornearia Barbosa: desktop da página inicial inteira e mobile da hero/home.
- New Rocket Play: desktop da landing page inteira e mobile da abertura.
- ENGRENI Agenda: captura da tela pública de agendamento e uma tela interna fictícia/sem dados de clientes.
- Se quiser incluir VITRINI, enviar catálogo no desktop e no mobile.

Prefira PNG ou WEBP com interface nítida e sem dados pessoais, notificações ou credenciais.

Prévia HTML autocontida: index.html. O formulário não envia dados nesta versão.


## Registro de publicação — 25/09/2026

A versão aprovada e consolidada do site está na branch `main`. Esta atualização documental registra a tentativa de nova publicação em produção após a falha anterior por limite de builds da Vercel; a confirmação de publicação deve ser verificada no status do deployment. Nenhum componente visual ou funcional foi alterado por este registro.
