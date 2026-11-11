# Decisões técnicas

Este documento guarda o detalhe das escolhas que fiz no projeto. O [README](../README.md) traz o resumo; aqui está o porquê de cada uma.

## Sumário

- [Decisões de teste](#decisões-de-teste)
- [Massa de dados em detalhe](#massa-de-dados-em-detalhe)
- [Qualidade de código e commits](#qualidade-de-código-e-commits)
- [Pipeline em detalhe](#pipeline-em-detalhe)
- [Segurança em detalhe](#segurança-em-detalhe)
- [Tecnologias](#tecnologias)

## Decisões de teste

| Decisão                                     | Por que decidi assim                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Pré-condições pela API                      | Criar um usuário pela API leva milissegundos e não depende de tela. O teste de tela usa a interface só para o que valida.                                                                     |
| Asserções nos specs, não nos page objects   | Quem abre o teste vê o que é esperado sem procurar em outro arquivo, e a mesma ação serve para um caso positivo e para um negativo.                                                           |
| Seletores `data-testid`                     | São estáveis e não dependem de estilo nem de texto. Onde o front não os oferece (título `h1`, alertas `.alert` e linhas da tabela de produtos), isolei o seletor de estrutura no page object. |
| Nenhum `cy.wait(ms)`                        | Prefiro sincronizar por asserções com retry e por `cy.intercept`. Espera fixa deixa o teste lento e instável.                                                                                 |
| Asserções sobre a requisição nos testes E2E | Além da tela, o `cy.intercept` confirma o status que o front recebeu da API. Isso ajuda a separar erro de front de erro de back-end.                                                          |
| Efeito colateral nos negativos da API       | Status e mensagem não bastam: nos casos de duplicidade e de falta de permissão, consulto a API para confirmar que nada foi criado.                                                            |
| Asserção por célula na listagem             | Comparar o texto da linha inteira deixaria um valor "casar" com outro campo (por exemplo, a quantidade 4 dentro do preço 1648).                                                               |
| Contrato com `additionalProperties: false`  | O teste falha se um campo sumir e também se aparecer um campo novo sem aviso.                                                                                                                 |
| Mensagens e rotas em constantes             | Se um texto mudar na aplicação, corrijo em um único lugar.                                                                                                                                    |
| `retries` só no pipeline, e reportados      | No CI, tolero a instabilidade do ambiente público, mas o teste que precisou de nova tentativa aparece no resumo do job. No desenvolvimento, não há nova tentativa.                            |
| `describe` / `context` / `it`, sem Cucumber | A estrutura já dá as três partes de um cenário sem a camada de step definitions. O Dado / Quando / Então ficou no plano de testes.                                                            |
| JavaScript com ES Modules                   | Atende ao requisito do desafio e mantém a mesma sintaxe de `import` no Node e no browser.                                                                                                     |

## Massa de dados em detalhe

### Onde o registro acontece

Todo cadastro que devolve um `_id` é anotado para limpeza no momento da resposta, antes de qualquer assertiva do teste:

- **Chamadas de API:** dentro do método `cadastrar` dos serviços de usuários e de produtos.
- **Cadastros feitos pela tela:** nos comandos `cy.observarCadastroDeUsuario` e `cy.observarCadastroDeProduto`, que interceptam a resposta da API.

Na primeira versão o registro ficava no teste, depois das assertivas. Se uma assertiva falhasse depois de um cadastro bem-sucedido, o registro era perdido e a massa ficava no ambiente. Mover o comando para cima no mesmo bloco não resolvia, porque um comando enfileirado não roda quando o teste quebra.

### Por que o registro fica no escopo global

O Cypress empacota o `support` e cada spec separadamente. Um módulo importado pelos dois é carregado duas vezes, com variáveis diferentes. Guardar a lista em `globalThis` faz todas as cópias enxergarem o mesmo registro.

### Por que a limpeza roda no Node

A limpeza está em `cypress/tarefas/limparMassa.js` e é chamada por `cy.task` em um `afterEach` global.

- Dentro do Cypress, os comandos rodam em fila. Um timeout em uma exclusão reprovava o hook, e as exclusões seguintes eram perdidas.
- No Node, cada exclusão tem o próprio tratamento de erro e um limite de 10 segundos. O que falhar vira um aviso no terminal e no resumo do job.
- O custo que assumi: as três chamadas HTTP da limpeza (cadastro, login e exclusão) ficam repetidas fora da classe base dos serviços.

### Por que a limpeza tem credencial própria

Só administrador exclui produto. Se um produto fosse criado indevidamente por um usuário comum, o token do teste não conseguiria apagá-lo. A tarefa cria um administrador só para a limpeza e o apaga por último.

### Por que conferir a mensagem da exclusão

O `DELETE` do ServeRest responde 200 mesmo quando nada é excluído. A limpeza compara a mensagem com "Registro excluído com sucesso".

### Limite conhecido

Se o processo do Cypress for encerrado no meio de um teste, o `afterEach` não roda e a massa daquele teste permanece no ambiente.

## Qualidade de código e commits

- **ESLint**: configurei regras que barram os problemas mais comuns em Cypress, como espera fixa (`cy.wait(1000)`), `{ force: true }`, `cy.pause` e `it.only`/`it.skip` esquecidos no repositório.
- **Prettier** cuida da formatação, e o `eslint-config-prettier` evita conflito entre os dois.
- **Husky + lint-staged**: o `pre-commit` roda lint e formatação nos arquivos alterados.
- **commitlint**: o `commit-msg` exige [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat`, `fix`, `test`, `ci`, `build`, `chore`, `docs`), com a descrição em português.
- **`.gitattributes`**: mantém o fim de linha LF em qualquer sistema. Sem ele, o Git no Windows converte os arquivos para CRLF e o Prettier acusa todos eles.
- **`.nvmrc`**: fixa a versão exata do Node, lida também pelo pipeline.

Scripts que não estão na tabela do README: `npm run lint:fix` corrige o que o ESLint permitir, e `npm run format` formata o projeto.

## Pipeline em detalhe

O workflow [`testes.yml`](../.github/workflows/testes.yml) tem 6 jobs:

| Job               | Linux | Windows | O que faz                                                |
| ----------------- | ----- | ------- | -------------------------------------------------------- |
| Lint e formatação | sim   | sim     | `npm ci` sem o binário do Cypress, lint e `format:check` |
| Testes de API     | sim   | sim     | Os casos de API, no Chrome                               |
| Testes de UI      | sim   | sim     | Os casos E2E, no Chrome                                  |

- **Quando roda:** push e pull request para a `main`, toda segunda-feira às 06h (horário de Brasília) e manualmente. A execução semanal existe porque o ServeRest é público: ela avisa se a aplicação mudar, mesmo sem commit no projeto.
- **`needs`:** os testes só rodam depois do lint passar.
- **`fail-fast: false`:** uma suíte não interrompe a outra.
- **`concurrency`:** um push novo cancela a execução anterior da mesma branch.
- **Relatório:** o HTML de cada suíte é publicado como artefato (por exemplo, `relatorio-ui-windows`), mesmo quando os testes falham. Uma execução sem relatório gera aviso.
- **Resumo do job:** testes que só passaram após nova tentativa e massa que não pôde ser removida aparecem na página da execução, e não só no log.
- **Windows:** mantive os testes também em Windows porque desenvolvi no macOS e quis a evidência de que o projeto roda nos dois sistemas.
- **Dependabot:** verifica toda semana as dependências do npm e as actions do pipeline.

## Segurança em detalhe

- **Nenhuma credencial no repositório**: não existe usuário fixo. Deixei `cypress.env.json` e `.env` no `.gitignore` por precaução.
- **Senhas descartáveis**: cada senha é gerada aleatoriamente e apagada junto com o usuário ao final do teste. Na interface, o campo de senha é digitado com `{ log: false }`. Nas chamadas de API, o corpo da requisição aparece no log de comandos do Cypress. Aceitei isso por serem dados de teste; com credenciais reais, eu usaria `log: false` também na requisição.
- **Configuração pública separada de segredos**: a URL da API usa o `expose` do Cypress 16, que é próprio para valores públicos. Um segredo viria de variável de ambiente lida com `cy.env()` e, no CI, de _GitHub Secrets_.
- **Pipeline com menor privilégio**: `permissions: contents: read`.
- **Dependências auditadas**: o `npm audit` não aponta vulnerabilidades. Duas dependências transitivas vulneráveis foram corrigidas com `overrides` (`minimatch` e `glob`), e fixei o `mocha` 12 pelo mesmo motivo. É uma troca consciente: forço versões acima das que as bibliotecas declararam, e por isso o projeto exige Node 22.13 ou superior.

## Tecnologias

| Ferramenta                                                                              | Para que eu usei                                  |
| --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Cypress 16](https://www.cypress.io/)                                                   | Testes E2E e de API                               |
| [Faker](https://fakerjs.dev/) (`pt_BR`)                                                 | Geração de massa de dados                         |
| [Ajv](https://ajv.js.org/)                                                              | Validação de contrato com JSON Schema             |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | Relatório HTML com gráficos e screenshots         |
| ESLint 10 + `eslint-plugin-cypress` + `eslint-plugin-mocha`                             | Análise estática                                  |
| Prettier                                                                                | Formatação                                        |
| Husky + lint-staged + commitlint                                                        | Validação antes do commit e padrão de mensagens   |
| GitHub Actions + Dependabot                                                             | Integração contínua e atualização de dependências |
