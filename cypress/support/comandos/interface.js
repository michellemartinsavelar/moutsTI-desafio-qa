import { registrarProduto, registrarUsuario } from '../massa/gerenciadorDeMassa'

/**
 * Abre uma rota do front já autenticado, gravando no localStorage o mesmo
 * estado que a tela de login gravaria. Evita repetir o login pela interface
 * em testes cujo foco é outra funcionalidade.
 */
Cypress.Commands.add('visitarAutenticado', (rota, { usuario, token }) => {
  cy.visit(rota, {
    onBeforeLoad(janela) {
      janela.localStorage.setItem('serverest/userEmail', usuario.email)
      janela.localStorage.setItem('serverest/userNome', usuario.nome)
      janela.localStorage.setItem('serverest/userToken', token)
    },
  })
})

/**
 * Observam os cadastros que o front envia para a API e registram para limpeza
 * tudo o que for criado. O registro acontece na própria resposta, então vale
 * mesmo se o teste falhar depois ou se a aplicação aceitar um cadastro que
 * deveria recusar. O alias permite ao teste esperar e validar a requisição.
 */
Cypress.Commands.add('observarCadastroDeUsuario', (alias) => {
  cy.intercept('POST', `${Cypress.expose('apiUrl')}/usuarios`, (requisicao) => {
    requisicao.continue((resposta) => {
      if (resposta.body?._id) {
        registrarUsuario(resposta.body._id)
      }
    })
  }).as(alias)
})

Cypress.Commands.add('observarCadastroDeProduto', (alias) => {
  cy.intercept('POST', `${Cypress.expose('apiUrl')}/produtos`, (requisicao) => {
    requisicao.continue((resposta) => {
      if (resposta.body?._id) {
        registrarProduto(resposta.body._id)
      }
    })
  }).as(alias)
})
