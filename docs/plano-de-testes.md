# Plano de testes - ServeRest

Este documento descreve os 29 casos de teste automatizados neste repositório. Cada caso tem um **ID único**, que aparece no título do teste (`it`) e no relatório de execução. É esse ID que liga o código ao plano de testes em uma ferramenta de gestão.

## Escopo

| Camada | Funcionalidade      | Alvo                                                 | Casos |
| ------ | ------------------- | ---------------------------------------------------- | ----- |
| API    | Login               | `POST /login`                                        | 7     |
| API    | Cadastro de usuário | `POST /usuarios` e `GET /usuarios/{_id}`             | 6     |
| API    | Cadastro de produto | `POST /produtos` e `GET /produtos/{_id}`             | 7     |
| E2E    | Login               | `/login`                                             | 4     |
| E2E    | Cadastro de usuário | `/cadastrarusuarios`                                 | 2     |
| E2E    | Cadastro de produto | `/admin/cadastrarprodutos` e `/admin/listarprodutos` | 3     |

**Ambiente:** ServeRest público ([front.serverest.dev](https://front.serverest.dev/) e [serverest.dev](https://serverest.dev/)), no Chrome, em Linux e Windows.

**Fora do escopo:** carrinho, edição e exclusão pela interface, testes de carga e de acessibilidade.

## Convenções

### IDs

O formato é `CAMADA-FUNCIONALIDADE-NN`:

| Parte          | Valores                                                                 |
| -------------- | ----------------------------------------------------------------------- |
| Camada         | `API` ou `E2E`                                                          |
| Funcionalidade | `LOG` (login), `USU` (cadastro de usuário), `PRO` (cadastro de produto) |
| Número         | sequencial dentro da funcionalidade, com dois dígitos                   |

Um ID nunca é reaproveitado: se um caso for removido, o número dele fica vago.

### Escrita dos testes

```
describe  →  Camada | Funcionalidade - endpoint ou tela
context   →  condição de negócio (com dados válidos, com e-mail já cadastrado...)
it        →  [ID] deve <resultado esperado> quando <situação>
```

O relatório se lê como uma especificação:

```
API | Login - POST /login
  com credenciais inválidas
    ✓ [API-LOG-02] deve retornar 401 quando a senha estiver incorreta
```

Os passos abaixo estão no formato **Dado / Quando / Então** para facilitar o cadastro na ferramenta de gestão. O código não usa Cucumber: a estrutura `describe` / `context` / `it` já expressa as mesmas três partes sem a camada extra de arquivos `.feature` e step definitions.

## Rastreabilidade com Jira ou Azure DevOps

1. Cadastre cada caso deste documento como um caso de teste (Test no Xray/Zephyr, ou Test Case no Azure Test Plans), usando o ID e o título como resumo.
2. Guarde a chave gerada pela ferramenta (por exemplo, `QA-123` ou `#4567`) junto do ID do caso.
3. Se a ferramenta importar resultados pelo nome do teste (como o Xray, que reconhece a chave no título), acrescente a chave ao título do `it`, por exemplo `[API-LOG-02][QA-123] deve ...`.

O ID interno continua valendo mesmo que a ferramenta de gestão mude.

## Casos de teste

### API - Login (`cypress/e2e/api/login.cy.js`)

| ID         | Caso de teste                      | Tipo     |
| ---------- | ---------------------------------- | -------- |
| API-LOG-01 | Login com credenciais válidas      | Positivo |
| API-LOG-02 | Login com senha incorreta          | Negativo |
| API-LOG-03 | Login com e-mail não cadastrado    | Negativo |
| API-LOG-04 | Login sem enviar e-mail e senha    | Negativo |
| API-LOG-05 | Login com e-mail e senha em branco | Negativo |
| API-LOG-06 | Login sem enviar o e-mail          | Negativo |
| API-LOG-07 | Login sem enviar a senha           | Negativo |

**API-LOG-01 - Login com credenciais válidas**

- **Dado** um administrador cadastrado
- **Quando** envio `POST /login` com e-mail e senha corretos
- **Então** recebo status 200, a mensagem "Login realizado com sucesso" e um token `Bearer`, no contrato `loginSucesso.json`
- **E** o token recebido é aceito em uma rota protegida (cadastro de produto responde 201)

**API-LOG-02 - Login com senha incorreta**

- **Dado** um usuário cadastrado
- **Quando** envio `POST /login` com o e-mail dele e uma senha errada
- **Então** recebo status 401, a mensagem "Email e/ou senha inválidos" e nenhum token

**API-LOG-03 - Login com e-mail não cadastrado**

- **Dado** um e-mail que não existe na base
- **Quando** envio `POST /login` com esse e-mail
- **Então** recebo status 401, a mensagem "Email e/ou senha inválidos" e nenhum token

**API-LOG-04 - Login sem enviar e-mail e senha**

- **Quando** envio `POST /login` com o corpo vazio
- **Então** recebo status 400 com "email é obrigatório" e "password é obrigatório"

**API-LOG-05 - Login com e-mail e senha em branco**

- **Quando** envio `POST /login` com e-mail e senha vazios (`""`)
- **Então** recebo status 400 com "email não pode ficar em branco" e "password não pode ficar em branco"

**API-LOG-06 e API-LOG-07 - Login com um único campo ausente**

- **Quando** envio `POST /login` sem um dos campos
- **Então** recebo status 400 apenas com a mensagem do campo que faltou

| ID         | Campo ausente | Mensagem esperada      |
| ---------- | ------------- | ---------------------- |
| API-LOG-06 | `email`       | email é obrigatório    |
| API-LOG-07 | `password`    | password é obrigatório |

### API - Cadastro de usuário (`cypress/e2e/api/usuarios.cy.js`)

| ID         | Caso de teste                                 | Tipo     |
| ---------- | --------------------------------------------- | -------- |
| API-USU-01 | Cadastro de usuário com dados válidos         | Positivo |
| API-USU-02 | Cadastro com e-mail já utilizado              | Negativo |
| API-USU-03 | Cadastro com nome em branco                   | Negativo |
| API-USU-04 | Cadastro com e-mail em formato inválido       | Negativo |
| API-USU-05 | Cadastro com senha em branco                  | Negativo |
| API-USU-06 | Cadastro com perfil de administrador inválido | Negativo |

**API-USU-01 - Cadastro de usuário com dados válidos**

- **Quando** envio `POST /usuarios` com nome, e-mail, senha e perfil válidos
- **Então** recebo status 201, a mensagem "Cadastro realizado com sucesso" e o `_id`, no contrato `cadastroSucesso.json`
- **E** ao consultar `GET /usuarios/{_id}` os dados retornados são os mesmos que enviei, no contrato `usuario.json`

**API-USU-02 - Cadastro com e-mail já utilizado**

- **Dado** um usuário cadastrado
- **Quando** envio `POST /usuarios` com o mesmo e-mail
- **Então** recebo status 400 e a mensagem "Este email já está sendo usado"
- **E** continua existindo apenas um usuário com esse e-mail

**API-USU-03 a API-USU-06 - Cadastro com campo inválido**

- **Quando** envio `POST /usuarios` com um único campo inválido
- **Então** recebo status 400 apenas com a mensagem daquele campo

| ID         | Campo           | Valor enviado          | Mensagem esperada                        |
| ---------- | --------------- | ---------------------- | ---------------------------------------- |
| API-USU-03 | `nome`          | `""`                   | nome não pode ficar em branco            |
| API-USU-04 | `email`         | `email-sem-arroba.com` | email deve ser um email válido           |
| API-USU-05 | `password`      | `""`                   | password não pode ficar em branco        |
| API-USU-06 | `administrador` | `sim`                  | administrador deve ser 'true' ou 'false' |

### API - Cadastro de produto (`cypress/e2e/api/produtos.cy.js`)

| ID         | Caso de teste                                     | Tipo     |
| ---------- | ------------------------------------------------- | -------- |
| API-PRO-01 | Cadastro de produto por administrador             | Positivo |
| API-PRO-02 | Cadastro de produto com nome já utilizado         | Negativo |
| API-PRO-03 | Cadastro de produto sem token de acesso           | Negativo |
| API-PRO-04 | Cadastro de produto por usuário não administrador | Negativo |
| API-PRO-05 | Cadastro de produto com preço zero                | Negativo |
| API-PRO-06 | Cadastro de produto com quantidade negativa       | Negativo |
| API-PRO-07 | Cadastro de produto com token inválido            | Negativo |

**API-PRO-01 - Cadastro de produto por administrador**

- **Dado** um administrador autenticado
- **Quando** envio `POST /produtos` com nome, preço, descrição e quantidade válidos
- **Então** recebo status 201, a mensagem "Cadastro realizado com sucesso" e o `_id`, no contrato `cadastroSucesso.json`
- **E** ao consultar `GET /produtos/{_id}` os dados retornados são os mesmos que enviei, no contrato `produto.json`

**API-PRO-02 - Cadastro de produto com nome já utilizado**

- **Dado** um administrador autenticado e um produto já cadastrado
- **Quando** envio `POST /produtos` com o mesmo nome
- **Então** recebo status 400 e a mensagem "Já existe produto com esse nome"
- **E** continua existindo apenas um produto com esse nome

**API-PRO-03 - Cadastro de produto sem token de acesso**

- **Quando** envio `POST /produtos` sem o cabeçalho `Authorization`
- **Então** recebo status 401 e a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"
- **E** o produto não é criado

**API-PRO-04 - Cadastro de produto por usuário não administrador**

- **Dado** um usuário comum autenticado
- **Quando** envio `POST /produtos` com o token dele
- **Então** recebo status 403 e a mensagem "Rota exclusiva para administradores"
- **E** o produto não é criado

**API-PRO-05 e API-PRO-06 - Cadastro de produto com valor inválido**

- **Dado** um administrador autenticado
- **Quando** envio `POST /produtos` com um único campo numérico inválido
- **Então** recebo status 400 apenas com a mensagem daquele campo

| ID         | Campo        | Valor enviado | Mensagem esperada                      |
| ---------- | ------------ | ------------- | -------------------------------------- |
| API-PRO-05 | `preco`      | `0`           | preco deve ser um número positivo      |
| API-PRO-06 | `quantidade` | `-1`          | quantidade deve ser maior ou igual a 0 |

**API-PRO-07 - Cadastro de produto com token inválido**

- **Quando** envio `POST /produtos` com um token malformado no cabeçalho `Authorization`
- **Então** recebo status 401 e a mensagem "Token de acesso ausente, inválido, expirado ou usuário do token não existe mais"
- **E** o produto não é criado

### E2E - Login (`cypress/e2e/ui/login.cy.js`)

| ID         | Caso de teste             | Tipo     |
| ---------- | ------------------------- | -------- |
| E2E-LOG-01 | Login de administrador    | Positivo |
| E2E-LOG-02 | Login de usuário comum    | Positivo |
| E2E-LOG-03 | Login com senha incorreta | Negativo |
| E2E-LOG-04 | Login com campos vazios   | Negativo |

**E2E-LOG-01 - Login de administrador**

- **Dado** um administrador cadastrado e a tela de login aberta
- **Quando** informo e-mail e senha e clico em "Entrar"
- **Então** a API responde 200, sou levado para `/admin/home`, vejo "Bem Vindo" com o meu nome e o botão "Logout"

**E2E-LOG-02 - Login de usuário comum**

- **Dado** um usuário comum cadastrado e a tela de login aberta
- **Quando** informo e-mail e senha e clico em "Entrar"
- **Então** a API responde 200, sou levado para `/home`, vejo o título "Serverest Store" e o botão "Logout"

**E2E-LOG-03 - Login com senha incorreta**

- **Dado** um usuário cadastrado e a tela de login aberta
- **Quando** informo o e-mail dele com uma senha errada e clico em "Entrar"
- **Então** a API responde 401, vejo o alerta "Email e/ou senha inválidos" e continuo em `/login`

**E2E-LOG-04 - Login com campos vazios**

- **Dado** a tela de login aberta
- **Quando** clico em "Entrar" sem preencher nada
- **Então** a API responde 400, vejo os alertas "Email é obrigatório" e "Password é obrigatório" e continuo em `/login`

### E2E - Cadastro de usuário (`cypress/e2e/ui/cadastroUsuario.cy.js`)

| ID         | Caso de teste                            | Tipo     |
| ---------- | ---------------------------------------- | -------- |
| E2E-USU-01 | Cadastro de administrador pela interface | Positivo |
| E2E-USU-02 | Cadastro com e-mail já utilizado         | Negativo |

**E2E-USU-01 - Cadastro de administrador pela interface**

- **Dado** a tela de cadastro aberta
- **Quando** preencho nome, e-mail e senha, marco "Cadastrar como administrador?" e clico em "Cadastrar"
- **Então** a API responde 201, vejo o alerta "Cadastro realizado com sucesso" e sou levado para `/admin/home` com "Bem Vindo" e o meu nome

**E2E-USU-02 - Cadastro com e-mail já utilizado**

- **Dado** um usuário cadastrado e a tela de cadastro aberta
- **Quando** preencho o formulário com o mesmo e-mail e clico em "Cadastrar"
- **Então** a API responde 400, vejo o alerta "Este email já está sendo usado" e continuo em `/cadastrarusuarios`

### E2E - Cadastro de produto (`cypress/e2e/ui/cadastroProduto.cy.js`)

| ID         | Caso de teste                             | Tipo     |
| ---------- | ----------------------------------------- | -------- |
| E2E-PRO-01 | Cadastro de produto pela interface        | Positivo |
| E2E-PRO-02 | Cadastro de produto com nome já utilizado | Negativo |
| E2E-PRO-03 | Cadastro de produto por usuário comum     | Negativo |

**E2E-PRO-01 - Cadastro de produto pela interface**

- **Dado** um administrador autenticado na tela de cadastro de produtos
- **Quando** preencho nome, preço, descrição e quantidade e clico em "Cadastrar"
- **Então** a API responde 201, sou levado para `/admin/listarprodutos` e o produto aparece na listagem com nome, preço, descrição e quantidade, cada um conferido na sua coluna

**E2E-PRO-02 - Cadastro de produto com nome já utilizado**

- **Dado** um administrador autenticado na tela de cadastro de produtos e um produto já cadastrado
- **Quando** preencho o formulário com o mesmo nome e clico em "Cadastrar"
- **Então** a API responde 400, vejo o alerta "Já existe produto com esse nome" e continuo em `/admin/cadastrarprodutos`

**E2E-PRO-03 - Cadastro de produto por usuário comum**

- **Dado** um usuário comum autenticado na tela de cadastro de produtos (o front permite abrir a tela)
- **Quando** preencho o formulário e clico em "Cadastrar"
- **Então** a API responde 403, vejo o alerta "Rota exclusiva para administradores" e continuo em `/admin/cadastrarprodutos`
- **E** o produto não é criado

## Massa de dados e limpeza

Todos os casos criam a própria massa (usuários e produtos), com dados gerados pelo Faker. Nenhum caso depende de dados pré-existentes nem da ordem de execução.

Todo cadastro que devolve um `_id` é registrado para limpeza no momento da resposta, antes das assertivas, em cenários positivos e negativos. Ao final de cada teste, uma tarefa no Node exclui o que foi registrado e trata cada exclusão separadamente: o que não puder ser removido aparece como aviso no terminal e no resumo do pipeline, sem reprovar o teste.
