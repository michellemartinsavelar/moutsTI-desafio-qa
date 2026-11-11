# Desafio Técnico Mouts TI - Senior QA Tester

[![Testes automatizados](https://github.com/michellemartinsavelar/moutsTI-desafio-qa/actions/workflows/testes.yml/badge.svg)](https://github.com/michellemartinsavelar/moutsTI-desafio-qa/actions/workflows/testes.yml)

<p align="center">
  <img src="docs/imagens/serverest-login.png" alt="Tela de login do ServeRest, a aplicação testada neste desafio" width="720">
</p>

Oi! Eu sou a Michelle, e este repositório é a minha entrega para o desafio técnico da vaga de **Senior QA Tester** na **Mouts TI**.

Aqui você encontra uma suíte de testes automatizados com **Cypress** e **JavaScript** para o [ServeRest](https://serverest.dev/), cobrindo o front-end ([front.serverest.dev](https://front.serverest.dev/)) e a API REST. Tentei deixar este README bem completo, para que dê para entender o que eu fiz e por que fiz sem precisar abrir o código. Mas fique à vontade para abrir também.

## Sumário

- [Sobre o desafio](#sobre-o-desafio)
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

## Sobre o desafio

### O que foi pedido

- Automatizar **3 cenários E2E** no front-end: [front.serverest.dev](https://front.serverest.dev/)
- Automatizar **3 cenários de API** com base no Swagger: [serverest.dev](https://serverest.dev/)
- Cobrir cenários **positivos e negativos**
- Usar **Cypress** com **JavaScript** e hospedar o código em um repositório **público no GitHub**

### Onde encontrar cada critério de avaliação

Para facilitar a vida de quem vai avaliar, liguei cada critério ao lugar do projeto em que ele aparece:

| Critério                            | Onde eu tratei disso                                                                                                                  |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Boas práticas e qualidade do código | [Qualidade de código e commits](#qualidade-de-código-e-commits) e [Decisões técnicas](#decisões-técnicas)                             |
| Padrões de projeto                  | [Padrões de projeto](#padrões-de-projeto): Page Object, Service Object, Factory e testes orientados a dados                           |
| Assertivas claras e adequadas       | Status, mensagem e contrato (JSON Schema) na API; tela e requisição interceptada no E2E. Veja [Cenários cobertos](#cenários-cobertos) |
| Escrita e organização dos cenários  | `describe` / `context` / `it` padronizados, com ID por caso e um [plano de testes](docs/plano-de-testes.md) rastreável                |
| Uso de massa de dados               | [Massa de dados](#massa-de-dados): dados dinâmicos, pré-condições via API e limpeza automática                                        |
| CI/CD, segurança e documentação     | [CI/CD](#cicd), [Segurança](#segurança) e este README                                                                                 |
| Qualidade e clareza dos commits     | Commits pequenos no padrão Conventional Commits, validados pelo commitlint                                                            |

## Cenários cobertos

Escolhi **3 cenários de API** e **3 cenários E2E**. Cada um tem casos positivos e negativos, e no total são **22 casos de teste**. Cada caso tem um ID único, que aparece no título do teste e no relatório.

| Camada | Cenário             | Positivos | Negativos | IDs                         |
| ------ | ------------------- | --------- | --------- | --------------------------- |
| API    | Login               | 1         | 4         | `API-LOG-01` a `API-LOG-05` |
| API    | Cadastro de usuário | 1         | 5         | `API-USU-01` a `API-USU-06` |
| API    | Cadastro de produto | 1         | 3         | `API-PRO-01` a `API-PRO-04` |
| E2E    | Login               | 2         | 1         | `E2E-LOG-01` a `E2E-LOG-03` |
| E2E    | Cadastro de usuário | 1         | 1         | `E2E-USU-01` e `E2E-USU-02` |
| E2E    | Cadastro de produto | 1         | 1         | `E2E-PRO-01` e `E2E-PRO-02` |

Escrevi também um **[plano de testes](docs/plano-de-testes.md)**, com cada caso em Dado / Quando / Então. Ele explica como vincular os casos a uma ferramenta de gestão, como o Jira ou o Azure Test Plans.

Todos os testes seguem a mesma estrutura. Eu gosto que o relatório possa ser lido como uma especificação:

```
API | Login - POST /login                         ← describe: funcionalidade e endpoint
  com credenciais inválidas                       ← context: condição de negócio
    ✓ [API-LOG-02] deve retornar 401 quando a senha estiver incorreta   ← it: ID e resultado esperado
```

E este é o relatório HTML gerado ao final de cada execução:

<p align="center">
  <img src="docs/imagens/relatorio.png" alt="Relatório HTML com os 22 casos de teste aprovados" width="720">
</p>

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

## Como executar

### Pré-requisitos

- Node.js **22.13 ou superior** (a versão que eu uso está no `.nvmrc`; com nvm, é só rodar `nvm use`)
- npm
- Git (no Windows, o [Git for Windows](https://gitforwindows.org/), que também roda os hooks do Husky)

O projeto funciona em **macOS, Linux e Windows**. Eu desenvolvi no macOS, e o pipeline roda lint e testes em Linux e em Windows a cada push. Um detalhe para quem usa Windows: o `nvm-windows` não lê o `.nvmrc`, então instale a versão com `nvm install 22` e `nvm use 22`, ou baixe o Node pelo [site oficial](https://nodejs.org/).

### Instalação

```bash
git clone https://github.com/michellemartinsavelar/moutsTI-desafio-qa.git
cd moutsTI-desafio-qa
npm ci
```

### Scripts

| Comando                | O que faz                                                |
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

Por padrão, os testes apontam para o ServeRest público. Se você quiser rodar contra outro ambiente, basta trocar as URLs por variável de ambiente, sem mexer no código.

macOS e Linux:

```bash
BASE_URL=http://localhost:3000 API_URL=http://localhost:3001 npm test
```

Windows (PowerShell):

```powershell
$env:BASE_URL="http://localhost:3000"; $env:API_URL="http://localhost:3001"; npm test
```

Não é preciso configurar nenhuma credencial: cada teste cria os próprios usuários. Explico melhor em [Segurança](#segurança).

## Estrutura do projeto

```
.
├── .github/
│   ├── workflows/testes.yml        # pipeline de CI
│   └── dependabot.yml              # atualização automática de dependências
├── .husky/                         # hooks de pre-commit e commit-msg
├── docs/
│   ├── imagens/                    # imagens usadas neste README
│   └── plano-de-testes.md          # casos de teste com IDs, passos e rastreabilidade
├── cypress/
│   ├── e2e/
│   │   ├── api/                    # testes de API (um arquivo por recurso)
│   │   └── ui/                     # testes E2E (um arquivo por funcionalidade)
│   ├── fixtures/
│   │   └── contratos/              # JSON Schemas das respostas da API
│   ├── tarefas/                    # código que roda no Node (limpeza da massa)
│   └── support/
│       ├── comandos/               # comandos customizados (pré-condições via API e acesso autenticado)
│       ├── constantes/             # mensagens da aplicação e rotas do front
│       ├── contratos/              # validador de contrato (Ajv)
│       ├── fabricas/               # geração de massa de dados (Faker)
│       ├── massa/                  # registro da massa criada pelos testes
│       ├── paginas/                # Page Objects
│       ├── servicos/               # Service Objects da API
│       └── e2e.js                  # ponto de entrada do support
├── cypress.config.js
├── eslint.config.js
└── commitlint.config.js
```

Pensei nessa estrutura para que incluir uma funcionalidade nova siga sempre o mesmo caminho: um serviço em `servicos/` (API) ou uma página em `paginas/` (UI), uma fábrica se houver massa nova, e o spec em `e2e/api` ou `e2e/ui`.

## Padrões de projeto

- **Page Object** (`support/paginas`): cada tela concentra seus seletores e ações. Deixei as **asserções nos specs**, porque prefiro que o page object só saiba _como_ interagir com a tela e que o teste mostre _o que_ está sendo validado.
- **Service Object** (`support/servicos`): cada recurso da API tem um serviço com métodos de negócio (`cadastrar`, `buscarPorId`, `excluir`). A classe `ServicoBase` centraliza a URL, o cabeçalho de autorização e o `failOnStatusCode: false`, que me permite validar os status de erro (400, 401, 403) de forma explícita.
- **Factory** (`support/fabricas`): funções que geram objetos válidos e aceitam sobrescritas, por exemplo `gerarUsuario({ email: emailExistente })`. Assim, em um cenário negativo, eu mudo só o campo que interessa.
- **Testes orientados a dados**: quando vários casos têm a mesma estrutura (como os de campo inválido), eu os descrevo em uma tabela e cada linha vira um teste, com nome próprio no relatório.
- **Teste de contrato**: valido as respostas de sucesso contra JSON Schemas com `additionalProperties: false`. Isso pega campos removidos, renomeados ou adicionados sem aviso.

## Massa de dados

Este foi o ponto em que eu mais investi, porque o ServeRest público é compartilhado com muita gente e eu não queria nem depender dos dados dos outros nem deixar lixo para trás.

- **Dinâmica e isolada**: todo usuário e produto é gerado pelo Faker, com e-mail baseado em UUID e nome de produto com sufixo aleatório. Nenhum teste depende de dados que já existam no ambiente nem de outro teste.
- **Pré-condições via API**: os testes E2E preparam o cenário pela API (`cy.criarUsuarioViaApi`, `cy.criarProdutoViaApi`), que é mais rápida e estável, e usam a interface só para o que estão validando. O comando `cy.visitarAutenticado` abre o front já logado, para não repetir o login pela tela.
- **Registro automático**: todo cadastro que devolve um `_id` é registrado para limpeza no momento da resposta, antes de qualquer assertiva. Isso acontece na camada de serviço (chamadas de API) e nos comandos `cy.observarCadastroDeUsuario` e `cy.observarCadastroDeProduto` (cadastros feitos pela tela). Vale também para os cenários negativos: se a aplicação criar algo que deveria recusar, o teste falha e o registro indevido é removido.
- **Limpeza resiliente**: um `afterEach` global entrega a massa registrada para uma tarefa que roda no Node (`cypress/tarefas/limparMassa.js`). Cada exclusão é tratada separadamente: erro HTTP, timeout ou falha de rede vira um aviso no terminal e no log do pipeline, sem reprovar o teste e sem impedir as demais exclusões. Os produtos são excluídos com uma credencial de administrador criada só para a limpeza, e não com o token do teste.

> **Uma curiosidade que me custou um tempinho:** o Cypress empacota o `support` e cada spec separadamente, então o módulo de massa é carregado mais de uma vez. Na primeira versão, o registro feito pelo teste ia para uma cópia e a limpeza olhava para outra. Por isso hoje o registro fica em um único objeto no escopo global da página de teste, compartilhado por todas as cópias do módulo.

**Limite que eu conheço:** se a própria tarefa de limpeza não puder ser executada (por exemplo, se o processo do Cypress for encerrado no meio do teste), a massa daquele teste permanece no ambiente.

## Qualidade de código e commits

- **ESLint**: configurei regras que barram os problemas mais comuns em Cypress, como espera fixa (`cy.wait(1000)`), `{ force: true }`, `cy.pause` e `it.only`/`it.skip` esquecidos no repositório.
- **Prettier** cuida da formatação, e o `eslint-config-prettier` evita conflito entre os dois.
- **Husky + lint-staged**: o `pre-commit` roda lint e formatação nos arquivos alterados.
- **commitlint**: o `commit-msg` exige [Conventional Commits](https://www.conventionalcommits.org/pt-br/) (`feat`, `fix`, `test`, `ci`, `build`, `chore`, `docs`), com a descrição em português.

## CI/CD

O workflow [`testes.yml`](.github/workflows/testes.yml) roda em todo push e pull request para a `main`, todos os dias às 06h (horário de Brasília) e também manualmente (`workflow_dispatch`).

1. **Lint e formatação**: falha rápido, sem baixar o binário do Cypress.
2. **Testes API** e **Testes UI**: rodam em paralelo no Chrome, só depois do lint passar. Usei `fail-fast: false` para que uma suíte não interrompa a outra.
3. **Relatório**: o HTML de cada suíte é publicado como artefato (por exemplo, `relatorio-ui-windows`), e o resumo aparece na página da execução.

Todos os jobs rodam em matriz com **Linux** (`ubuntu-24.04`) e **Windows** (`windows-2025`). Para isso funcionar, precisei do arquivo `.gitattributes`, que mantém o fim de linha LF nos dois sistemas. Sem ele, o Git no Windows converte os arquivos para CRLF e o Prettier acusa todos eles.

A execução diária existe porque o ServeRest é um ambiente público: ela me avisa se a aplicação mudar, mesmo sem nenhum commit no projeto.

## Segurança

- **Nenhuma credencial no repositório**: não existe usuário fixo, porque cada teste cria e remove os próprios usuários. Deixei `cypress.env.json` e `.env` no `.gitignore` por precaução.
- **Senhas descartáveis**: cada senha é gerada aleatoriamente e apagada junto com o usuário ao final do teste. Na interface, o campo de senha é digitado com `{ log: false }`. Nas chamadas de API, o corpo da requisição aparece no log de comandos do Cypress. Aceitei isso por serem dados de teste; com credenciais reais, eu usaria `log: false` também na requisição.
- **Configuração pública separada de segredos**: a URL da API usa o `expose` do Cypress 16, que é próprio para valores públicos. Se um dia houver segredo, ele deve vir de variável de ambiente lida com `cy.env()` e, no CI, de _GitHub Secrets_.
- **Pipeline com menor privilégio**: `permissions: contents: read`.
- **Dependências auditadas**: o `npm audit` não aponta vulnerabilidades. Corrigi as versões transitivas vulneráveis com `overrides`, e o Dependabot mantém npm e actions atualizados.

## Decisões técnicas

Algumas escolhas que fiz pelo caminho e o motivo de cada uma:

| Decisão                                     | Por que decidi assim                                                                                                                                                                          |
| ------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Seletores `data-testid`                     | São estáveis e não dependem de estilo nem de texto. Onde o front não os oferece (título `h1`, alertas `.alert` e linhas da tabela de produtos), isolei o seletor de estrutura no page object. |
| Nenhum `cy.wait(ms)`                        | Prefiro sincronizar por asserções com retry e por `cy.intercept`. Espera fixa deixa o teste lento e instável.                                                                                 |
| `retries` só no `runMode`                   | No CI, tolero a instabilidade do ambiente público. No desenvolvimento, não quero esconder um teste intermitente.                                                                              |
| Asserções sobre a requisição nos testes E2E | Além da tela, o `cy.intercept` confirma o status que o front recebeu da API. Isso ajuda a separar erro de front de erro de back-end.                                                          |
| Mensagens e rotas em constantes             | Se um texto mudar na aplicação, corrijo em um único lugar.                                                                                                                                    |
| Efeito colateral nos negativos da API       | Status e mensagem não bastam: nos casos de duplicidade e de falta de permissão, consulto a API para confirmar que nada foi criado.                                                            |
| Limpeza de massa em tarefa Node             | Fora da fila de comandos do Cypress, uma falha em uma exclusão não interrompe as outras nem reprova o teste. O custo é repetir no Node as três chamadas HTTP da limpeza.                      |
| Asserção por célula na listagem             | Comparar o texto da linha inteira deixaria um valor "casar" com outro campo (por exemplo, a quantidade 4 dentro do preço 1648).                                                               |
| JavaScript com ES Modules                   | Atende ao requisito do desafio e mantém a mesma sintaxe de `import` no Node e no browser.                                                                                                     |

### O que eu observei na aplicação

Testando, encontrei alguns comportamentos do ServeRest que valem o registro:

- A home administrativa mostra `Bem Vindo` com **espaço duplo** antes do nome. Por isso valido a saudação e o nome separadamente.
- **Achado de segurança:** `GET /usuarios` devolve a senha de todos os usuários em texto puro. Em uma aplicação real, eu reportaria isso como defeito crítico: senhas devem ser armazenadas com hash e nunca retornadas pela API.
- `DELETE /usuarios/{_id}` responde 200 mesmo quando nada é excluído ("Nenhum registro excluído"). Por isso a limpeza de massa confere a mensagem, e não só o status.
- O ambiente público é compartilhado com outras pessoas. Por isso nenhum teste depende de dados que já existam nele, e toda massa criada é removida ao final.

---

Obrigada por chegar até aqui! Se tiver qualquer dúvida sobre o projeto, vai ser um prazer conversar.
