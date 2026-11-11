import cadastroUsuarioPagina from '../../support/paginas/cadastroUsuarioPagina'
import homePagina from '../../support/paginas/homePagina'
import alerta from '../../support/paginas/componentes/alerta'
import { gerarUsuario } from '../../support/fabricas/usuarioFabrica'
import { ROTAS } from '../../support/constantes/rotas'
import { MENSAGENS } from '../../support/constantes/mensagens'

describe('E2E | Cadastro de usuário', () => {
  beforeEach(() => {
    cy.observarCadastroDeUsuario('cadastrarUsuario')
    cadastroUsuarioPagina.visitar()
  })

  context('com dados válidos', () => {
    it('[E2E-USU-01] deve cadastrar o administrador e direcioná-lo para a home administrativa', () => {
      const administrador = gerarUsuario({ administrador: 'true' })

      cadastroUsuarioPagina.cadastrar(administrador)

      cy.wait('@cadastrarUsuario').its('response.statusCode').should('equal', 201)
      alerta.comTexto(MENSAGENS.cadastro.sucesso).should('be.visible')
      cy.location('pathname').should('equal', ROTAS.homeAdministrador)
      // o front coloca dois espaços depois de "Bem Vindo", por isso valido em duas partes
      homePagina
        .titulo()
        .should('contain.text', 'Bem Vindo')
        .and('contain.text', administrador.nome)
    })
  })

  context('com e-mail já cadastrado', () => {
    it('[E2E-USU-02] deve exibir alerta de e-mail em uso e permanecer na tela de cadastro', () => {
      cy.criarUsuarioViaApi().then((usuarioExistente) => {
        cadastroUsuarioPagina.cadastrar(gerarUsuario({ email: usuarioExistente.email }))

        cy.wait('@cadastrarUsuario').its('response.statusCode').should('equal', 400)
        alerta.comTexto(MENSAGENS.usuario.emailEmUso).should('be.visible')
        cy.location('pathname').should('equal', ROTAS.cadastroUsuario)
      })
    })
  })
})
