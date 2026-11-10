import cadastroProdutoPagina from '../../support/paginas/cadastroProdutoPagina'
import listagemProdutosPagina from '../../support/paginas/listagemProdutosPagina'
import alerta from '../../support/paginas/componentes/alerta'
import { gerarProduto } from '../../support/fabricas/produtoFabrica'
import { ROTAS } from '../../support/constantes/rotas'
import { MENSAGENS } from '../../support/constantes/mensagens'

describe('E2E | Cadastro de produto', () => {
  let tokenAdministrador

  // Pré-condição comum: administrador autenticado na tela de cadastro de produtos
  beforeEach(() => {
    cy.intercept('POST', `${Cypress.expose('apiUrl')}/produtos`).as('cadastrarProduto')

    cy.criarUsuarioViaApi({ administrador: 'true' }).then((administrador) => {
      cy.obterTokenViaApi(administrador).then((token) => {
        tokenAdministrador = token
        cy.visitarAutenticado(ROTAS.cadastroProduto, { usuario: administrador, token })
      })
    })
  })

  context('com dados válidos', () => {
    it('[E2E-PRO-01] deve cadastrar o produto e exibi-lo na listagem', () => {
      const produto = gerarProduto()

      cadastroProdutoPagina.cadastrar(produto)

      cy.wait('@cadastrarProduto').then(({ response }) => {
        expect(response.statusCode).to.equal(201)
        cy.registrarProdutoParaLimpeza(response.body._id, tokenAdministrador)
      })
      cy.location('pathname').should('equal', ROTAS.listagemProdutos)
      // Cada coluna é validada separadamente: comparar o texto da linha inteira
      // deixaria um valor "casar" com outro campo (ex.: quantidade 4 dentro do preço 1648)
      listagemProdutosPagina.celulaDoProduto(produto.nome, 'nome').should('have.text', produto.nome)
      listagemProdutosPagina
        .celulaDoProduto(produto.nome, 'preco')
        .should('have.text', String(produto.preco))
      listagemProdutosPagina
        .celulaDoProduto(produto.nome, 'descricao')
        .should('have.text', produto.descricao)
      listagemProdutosPagina
        .celulaDoProduto(produto.nome, 'quantidade')
        .should('have.text', String(produto.quantidade))
    })
  })

  context('com nome de produto já cadastrado', () => {
    it('[E2E-PRO-02] deve exibir alerta de nome em uso e permanecer na tela de cadastro', () => {
      cy.criarProdutoViaApi(tokenAdministrador).then((produtoExistente) => {
        cadastroProdutoPagina.cadastrar(gerarProduto({ nome: produtoExistente.nome }))

        cy.wait('@cadastrarProduto').its('response.statusCode').should('equal', 400)
        alerta.comTexto(MENSAGENS.produto.nomeEmUso).should('be.visible')
        cy.location('pathname').should('equal', ROTAS.cadastroProduto)
      })
    })
  })
})
