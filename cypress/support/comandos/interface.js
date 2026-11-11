import { registrarProduto, registrarUsuario } from '../massa/gerenciadorDeMassa'

// abre a rota já logado, sem passar pela tela de login
Cypress.Commands.add('visitarAutenticado', (rota, { usuario, token }) => {
  cy.visit(rota, {
    onBeforeLoad(janela) {
      janela.localStorage.setItem('serverest/userEmail', usuario.email)
      janela.localStorage.setItem('serverest/userNome', usuario.nome)
      janela.localStorage.setItem('serverest/userToken', token)
    },
  })
})

// registram para limpeza o que a tela cadastrar, direto na resposta da API
Cypress.Commands.add('observarCadastroDeUsuario', (alias) => {
  cy.intercept('POST', `${Cypress.expose('apiUrl')}/usuarios`, (requisicao) => {
    requisicao.continue((resposta) => {
      registrarUsuario(resposta.body?._id)
    })
  }).as(alias)
})

Cypress.Commands.add('observarCadastroDeProduto', (alias) => {
  cy.intercept('POST', `${Cypress.expose('apiUrl')}/produtos`, (requisicao) => {
    requisicao.continue((resposta) => {
      registrarProduto(resposta.body?._id)
    })
  }).as(alias)
})
