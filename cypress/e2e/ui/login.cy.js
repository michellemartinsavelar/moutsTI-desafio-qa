import loginPagina from '../../support/paginas/loginPagina'
import homePagina from '../../support/paginas/homePagina'
import alerta from '../../support/paginas/componentes/alerta'
import { ROTAS } from '../../support/constantes/rotas'
import { MENSAGENS } from '../../support/constantes/mensagens'

describe('E2E | Login', () => {
  beforeEach(() => {
    loginPagina.visitar()
  })

  context('com credenciais válidas', () => {
    it('[E2E-LOG-01] deve direcionar o administrador para a home administrativa', () => {
      cy.criarUsuarioViaApi({ administrador: 'true' }).then((administrador) => {
        loginPagina.realizarLogin(administrador)

        cy.location('pathname').should('equal', ROTAS.homeAdministrador)
        // O front exibe espaço duplo após "Bem Vindo": as partes são validadas separadamente
        homePagina
          .titulo()
          .should('contain.text', 'Bem Vindo')
          .and('contain.text', administrador.nome)
        homePagina.botaoLogout().should('be.visible')
      })
    })

    it('[E2E-LOG-02] deve direcionar o usuário comum para a loja', () => {
      cy.criarUsuarioViaApi({ administrador: 'false' }).then((usuarioComum) => {
        loginPagina.realizarLogin(usuarioComum)

        cy.location('pathname').should('equal', ROTAS.home)
        homePagina.titulo().should('contain.text', 'Serverest Store')
        homePagina.botaoLogout().should('be.visible')
      })
    })
  })

  context('com credenciais inválidas', () => {
    it('[E2E-LOG-03] deve exibir alerta de credenciais inválidas e permanecer na tela de login', () => {
      cy.criarUsuarioViaApi().then((usuario) => {
        loginPagina.realizarLogin({ email: usuario.email, password: 'senhaIncorreta' })

        alerta.comTexto(MENSAGENS.login.credenciaisInvalidas).should('be.visible')
        cy.location('pathname').should('equal', ROTAS.login)
      })
    })
  })
})
