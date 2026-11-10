import cadastroUsuarioPagina from '../../support/paginas/cadastroUsuarioPagina'
import homePagina from '../../support/paginas/homePagina'
import alerta from '../../support/paginas/componentes/alerta'
import { gerarUsuario } from '../../support/fabricas/usuarioFabrica'
import { ROTAS } from '../../support/constantes/rotas'
import { MENSAGENS } from '../../support/constantes/mensagens'

describe('E2E - Cadastro de usuário', () => {
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.expose('apiUrl')}/usuarios`).as('cadastrarUsuario')
    cadastroUsuarioPagina.visitar()
  })

  it('deve cadastrar um administrador e direcioná-lo para a home administrativa', () => {
    const administrador = gerarUsuario({ administrador: 'true' })

    cadastroUsuarioPagina.cadastrar(administrador)

    cy.wait('@cadastrarUsuario').then(({ response }) => {
      expect(response.statusCode).to.equal(201)
      cy.registrarUsuarioParaLimpeza(response.body._id)
    })
    alerta.comTexto(MENSAGENS.cadastro.sucesso).should('be.visible')
    cy.location('pathname').should('equal', ROTAS.homeAdministrador)
    // O front exibe espaço duplo após "Bem Vindo": as partes são validadas separadamente
    homePagina.titulo().should('contain.text', 'Bem Vindo').and('contain.text', administrador.nome)
  })

  it('não deve cadastrar um usuário com e-mail já utilizado', () => {
    cy.criarUsuarioViaApi().then((usuarioExistente) => {
      cadastroUsuarioPagina.cadastrar(gerarUsuario({ email: usuarioExistente.email }))

      cy.wait('@cadastrarUsuario').its('response.statusCode').should('equal', 400)
      alerta.comTexto(MENSAGENS.usuario.emailEmUso).should('be.visible')
      cy.location('pathname').should('equal', ROTAS.cadastroUsuario)
    })
  })
})
