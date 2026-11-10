# Desafio QA - Automação de testes do ServeRest

[![Testes automatizados](https://github.com/michellemartinsavelar/moutsTI-desafio-qa/actions/workflows/testes.yml/badge.svg)](https://github.com/michellemartinsavelar/moutsTI-desafio-qa/actions/workflows/testes.yml)

Suíte de testes automatizados com **Cypress** e **JavaScript** para a aplicação [ServeRest](https://serverest.dev/), cobrindo o front-end ([front.serverest.dev](https://front.serverest.dev/)) e a API REST.

## Sumário

- [Cenários cobertos](#cenários-cobertos)
- [Tecnologias](#tecnologias)
- [Como executar](#como-executar)
- [Estrutura do projeto](#estrutura-do-projeto)
- [Padrões de projeto](#padrões-de-projeto)
- [Massa de dados](#massa-de-dados)
- [Qualidade de código e commits](#qualidade-de-código-e-commits)
- [CI/CD](#cicd)
- [Segurança](#segurança)
- [Decisões técnicas](#decisões-técnicas)

## Cenários cobertos

São **3 cenários de API** e **3 cenários E2E**. Cada um tem casos positivos e negativos, num total de 22 testes.

### API

| Cenário                 | Casos                                                                                                                                                             |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Login**               | ✅ autenticação válida com validação de contrato<br>❌ senha incorreta<br>❌ e-mail não cadastrado<br>❌ campos ausentes<br>❌ campos em branco                   |
| **Cadastro de usuário** | ✅ cadastro com persistência dos dados (POST + GET) e contrato<br>❌ e-mail já utilizado<br>❌ cada campo inválido (`nome`, `email`, `password`, `administrador`) |
| **Cadastro de produto** | ✅ cadastro por administrador com persistência e contrato<br>❌ sem token (401)<br>❌ usuário sem permissão (403)<br>❌ nome já utilizado                         |

### E2E

| Cenário                 | Casos                                                                                                                  |
| ----------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **Login**               | ✅ administrador vai para a home administrativa<br>✅ usuário comum vai para a loja<br>❌ senha incorreta exibe alerta |
| **Cadastro de usuário** | ✅ cadastro de administrador pela interface e redirecionamento<br>❌ e-mail já utilizado exibe alerta                  |
| **Cadastro de produto** | ✅ administrador cadastra produto e ele aparece na listagem<br>❌ nome já utilizado exibe alerta                       |

## Tecnologias

| Ferramenta                                                                              | Uso                                               |
| --------------------------------------------------------------------------------------- | ------------------------------------------------- |
| [Cypress 16](https://www.cypress.io/)                                                   | Testes E2E e de API                               |
| [Faker](https://fakerjs.dev/) (`pt_BR`)                                                 | Geração de massa de dados                         |
| [Ajv](https://ajv.js.org/)                                                              | Validação de contrato com JSON Schema             |
| [cypress-mochawesome-reporter](https://github.com/LironEr/cypress-mochawesome-reporter) | Relatório HTML com gráficos e screenshots         |
| ESLint 10 + `eslint-plugin-cypress` + `eslint-plugin-mocha`                             | Análise estática                                  |
| Prettier                                                                                | Formatação                                        |
| Husky + lint-staged + commitlint                                                        | Validação antes do commit e padrão de mensagens   |
| GitHub Actions + Dependabot                                                             | Integração contínua e atualização de dependências |

## Como executar

### Pré-requisitos

- Node.js **22.13 ou superior** (a versão de referência está no `.nvmrc`; com nvm, rode `nvm use`)
- npm

### Instalação

```bash
git clone https://github.com/michellemartinsavelar/moutsTI-desafio-qa.git
cd moutsTI-desafio-qa
npm ci
```

### Scripts

| Comando                | Descrição                                                |
| ---------------------- | -------------------------------------------------------- |
| `npm test`             | Executa todos os testes em modo headless                 |
| `npm run test:api`     | Executa apenas os testes de API                          |
| `npm run test:ui`      | Executa apenas os testes E2E                             |
| `npm run cy:open`      | Abre o Cypress no modo interativo                        |
| `npm run lint`         | Verifica o código com ESLint                             |
| `npm run lint:fix`     | Corrige automaticamente o que o ESLint permitir          |
| `npm run format`       | Formata o projeto com Prettier                           |
| `npm run format:check` | Verifica a formatação sem alterar arquivos               |
| `npm run empacotar`    | Gera o `.zip` de entrega apenas com arquivos versionados |

Depois da execução, o relatório fica em `cypress/reports/index.html`.

### Ambientes

As URLs têm valores padrão apontando para o ServeRest público e podem ser trocadas por variável de ambiente, sem alterar código:

```bash
BASE_URL=http://localhost:3000 API_URL=http://localhost:3001 npm test
```

O projeto não precisa de nenhuma credencial: cada teste cria os próprios usuários. Veja [Segurança](#segurança).

## Estrutura do projeto

```
.
├── .github/
│   ├── workflows/testes.yml        # pipeline de CI
│   └── dependabot.yml              # atualização automática de dependências
├── .husky/                         # hooks de pre-commit e commit-msg
├── cypress/
│   ├── e2e/
│   │   ├── api/                    # testes de API (um arquivo por recurso)
│   │   └── ui/                     # testes E2E (um arquivo por funcionalidade)
│   ├── fixtures/
│   │   └── contratos/              # JSON Schemas das respostas da API
│   └── support/
│       ├── comandos/               # comandos customizados (pré-condições via API e acesso autenticado)
│       ├── constantes/             # mensagens da aplicação e rotas do front
│       ├── contratos/              # validador de contrato (Ajv)
│       ├── fabricas/               # geração de massa de dados (Faker)
│       ├── massa/                  # registro e limpeza da massa criada
│       ├── paginas/                # Page Objects
│       ├── servicos/               # Service Objects da API
│       └── e2e.js                  # ponto de entrada do support
├── cypress.config.js
├── eslint.config.js
└── commitlint.config.js
```

Para incluir uma funcionalidade nova, o caminho é sempre o mesmo: um serviço em `servicos/` (API) ou uma página em `paginas/` (UI), uma fábrica se houver massa nova, e o spec em `e2e/api` ou `e2e/ui`.

## Padrões de projeto

- **Page Object** (`support/paginas`): cada tela concentra seus seletores e ações. As **asserções ficam nos specs**, para que o page object só saiba _como_ interagir com a tela e o teste deixe claro _o que_ está sendo validado.
- **Service Object** (`support/servicos`): cada recurso da API tem um serviço com métodos de negócio (`cadastrar`, `buscarPorId`, `excluir`). A classe `ServicoBase` centraliza URL, cabeçalho de autorização e `failOnStatusCode: false`, o que permite validar status de erro (400, 401, 403) de forma explícita.
- **Factory** (`support/fabricas`): funções que geram objetos válidos e aceitam sobrescritas, por exemplo `gerarUsuario({ email: emailExistente })`. Assim um cenário negativo muda só o campo que interessa.
- **Testes orientados a dados**: casos com a mesma estrutura (como campos inválidos) são descritos em uma tabela e geram um teste cada, com nome próprio no relatório.
- **Teste de contrato**: as respostas de sucesso são validadas contra JSON Schemas com `additionalProperties: false`, o que detecta campos removidos, renomeados ou adicionados.

## Massa de dados

- **Dinâmica e isolada**: todo usuário e produto é gerado pelo Faker, com e-mail baseado em UUID e nome de produto com sufixo aleatório. Nenhum teste depende de dados pré-existentes no ambiente nem de outro teste.
- **Pré-condições via API**: os testes E2E preparam o cenário pela API (`cy.criarUsuarioViaApi`, `cy.criarProdutoViaApi`), que é mais rápida e estável, e usam a interface só para o que estão validando. O comando `cy.visitarAutenticado` abre o front já logado para não repetir o login pela tela.
- **Limpeza automática**: tudo o que é criado fica registrado e é excluído em um `afterEach` global, inclusive quando o teste falha. Nos testes E2E, o `_id` de um cadastro feito pela tela é capturado com `cy.intercept`.

> **Atenção:** o Cypress empacota o `support` e cada spec separadamente. Se um spec importasse o gerenciador de massa diretamente, usaria outra instância do módulo, e o `afterEach` global não veria o registro. Por isso o registro é exposto como comando (`cy.registrarUsuarioParaLimpeza`) e uma regra do ESLint bloqueia o import direto nos specs.

## Qualidade de código e commits

- **ESLint** com regras que impedem problemas comuns em Cypress: espera fixa (`cy.wait(1000)`), `{ force: true }`, `cy.pause`, e `it.only`/`it.skip` esquecidos no repositório.
- **Prettier** cuida da formatação, e o `eslint-config-prettier` evita conflito entre os dois.
- **Husky + lint-staged**: o `pre-commit` roda lint e formatação nos arquivos alterados.
- **commitlint**: o `commit-msg` exige [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat`, `fix`, `test`, `ci`, `build`, `chore`, `docs`), com descrição em português.

## CI/CD

O workflow [`testes.yml`](.github/workflows/testes.yml) roda em push e pull request para `main`, diariamente às 06h (horário de Brasília) e manualmente (`workflow_dispatch`).

1. **Lint e formatação**: falha rápido, sem baixar o binário do Cypress.
2. **Testes API** e **Testes UI**: rodam em paralelo (matriz) no Chrome, só depois do lint passar. `fail-fast: false` garante que uma suíte não interrompa a outra.
3. **Relatório**: o HTML de cada suíte é publicado como artefato (`relatorio-api`, `relatorio-ui`), e o resumo aparece na página da execução.

A execução diária existe porque o ServeRest é um ambiente público e compartilhado: ela detecta mudanças na aplicação mesmo sem commits no projeto.

## Segurança

- **Nenhuma credencial no repositório**: não há usuário fixo; cada teste cria e remove os próprios usuários. `cypress.env.json` e `.env` estão no `.gitignore` por precaução.
- **Senhas fora do log**: o campo de senha é digitado com `{ log: false }`.
- **Configuração pública separada de segredos**: a URL da API usa `expose` do Cypress 16, que é próprio para valores públicos. Se um dia houver segredo, ele deve vir de variável de ambiente lida com `cy.env()` e, no CI, de _GitHub Secrets_.
- **Pipeline com menor privilégio**: `permissions: contents: read`.
- **Dependências auditadas**: `npm audit` sem vulnerabilidades. Versões transitivas vulneráveis foram corrigidas com `overrides`, e o Dependabot mantém npm e actions atualizados.

## Decisões técnicas

| Decisão                                     | Motivo                                                                                                                                    |
| ------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| Seletores `data-testid`                     | São estáveis e independentes de estilo e texto; o front do ServeRest já os oferece.                                                       |
| Nenhum `cy.wait(ms)`                        | Sincronização por asserções com retry e `cy.intercept`; esperas fixas deixam o teste lento e instável.                                    |
| `retries` só no `runMode`                   | Tolera instabilidade do ambiente público no CI sem esconder flakiness durante o desenvolvimento.                                          |
| Asserções sobre a requisição nos testes E2E | Além da tela, o `cy.intercept` confirma o status que o front recebeu da API, o que ajuda a diferenciar erro de front de erro de back-end. |
| Mensagens e rotas em constantes             | Se um texto mudar na aplicação, a correção é feita em um único lugar.                                                                     |
| JavaScript com ES Modules                   | Atende ao requisito do desafio e mantém a mesma sintaxe de `import` no Node e no browser.                                                 |

### Observações sobre a aplicação

- A home administrativa mostra `Bem Vindo` com **espaço duplo** antes do nome. O teste valida a saudação e o nome separadamente, para não depender desse detalhe de espaçamento.
- O ServeRest público é compartilhado com outras pessoas, por isso nenhum teste depende de dados que já existam nele e toda massa criada é removida ao final.
