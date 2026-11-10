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
