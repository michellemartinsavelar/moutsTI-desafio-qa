import cadastroProdutoPagina from '../../support/paginas/cadastroProdutoPagina'
import listagemProdutosPagina from '../../support/paginas/listagemProdutosPagina'
import alerta from '../../support/paginas/componentes/alerta'
import { gerarProduto } from '../../support/fabricas/produtoFabrica'
import { ROTAS } from '../../support/constantes/rotas'
import { MENSAGENS } from '../../support/constantes/mensagens'

describe('E2E - Cadastro de produto pelo administrador', () => {
  let administrador
  let tokenAdministrador

  beforeEach(() => {
    cy.intercept('POST', `${Cypress.expose('apiUrl')}/produtos`).as('cadastrarProduto')

    cy.criarUsuarioViaApi({ administrador: 'true' })
      .then((usuarioCriado) => {
        administrador = usuarioCriado

        return cy.obterTokenViaApi(administrador)
      })
      .then((token) => {
        tokenAdministrador = token
        cy.visitarAutenticado(ROTAS.cadastroProduto, { usuario: administrador, token })
      })
  })

  it('deve cadastrar um produto e exibi-lo na listagem', () => {
    const produto = gerarProduto()

    cadastroProdutoPagina.cadastrar(produto)

    cy.wait('@cadastrarProduto').then(({ response }) => {
      expect(response.statusCode).to.equal(201)
      cy.registrarProdutoParaLimpeza(response.body._id, tokenAdministrador)
    })
    cy.location('pathname').should('equal', ROTAS.listagemProdutos)
    listagemProdutosPagina
      .linhaDoProduto(produto.nome)
      .should('be.visible')
      .and('contain.text', produto.preco)
      .and('contain.text', produto.descricao)
      .and('contain.text', produto.quantidade)
  })

  it('não deve cadastrar um produto com nome já utilizado', () => {
    cy.criarProdutoViaApi(tokenAdministrador).then((produtoExistente) => {
      cadastroProdutoPagina.cadastrar(gerarProduto({ nome: produtoExistente.nome }))

      cy.wait('@cadastrarProduto').its('response.statusCode').should('equal', 400)
      alerta.comTexto(MENSAGENS.produto.nomeEmUso).should('be.visible')
      cy.location('pathname').should('equal', ROTAS.cadastroProduto)
    })
  })
})
