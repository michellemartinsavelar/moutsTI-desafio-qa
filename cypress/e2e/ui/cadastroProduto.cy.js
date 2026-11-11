import cadastroProdutoPagina from '../../support/paginas/cadastroProdutoPagina'
import listagemProdutosPagina from '../../support/paginas/listagemProdutosPagina'
import alerta from '../../support/paginas/componentes/alerta'
import produtosServico from '../../support/servicos/produtosServico'
import { gerarProduto } from '../../support/fabricas/produtoFabrica'
import { ROTAS } from '../../support/constantes/rotas'
import { MENSAGENS } from '../../support/constantes/mensagens'

describe('E2E | Cadastro de produto', () => {
  beforeEach(() => {
    cy.observarCadastroDeProduto('cadastrarProduto')
  })

  context('com administrador autenticado', () => {
    let tokenAdministrador

    beforeEach(() => {
      cy.criarUsuarioViaApi({ administrador: 'true' }).then((administrador) => {
        cy.obterTokenViaApi(administrador).then((token) => {
          tokenAdministrador = token
          cy.visitarAutenticado(ROTAS.cadastroProduto, { usuario: administrador, token })
        })
      })
    })

    it('[E2E-PRO-01] deve cadastrar o produto e exibi-lo na listagem', () => {
      const produto = gerarProduto()

      cadastroProdutoPagina.cadastrar(produto)

      cy.wait('@cadastrarProduto').its('response.statusCode').should('equal', 201)
      cy.location('pathname').should('equal', ROTAS.listagemProdutos)
      // valido coluna por coluna: no texto da linha inteira, a quantidade 4
      // "passaria" por estar dentro do preço 1648
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

    it('[E2E-PRO-02] deve exibir alerta e permanecer na tela quando o nome já estiver em uso', () => {
      cy.criarProdutoViaApi(tokenAdministrador).then((produtoExistente) => {
        cadastroProdutoPagina.cadastrar(gerarProduto({ nome: produtoExistente.nome }))

        cy.wait('@cadastrarProduto').its('response.statusCode').should('equal', 400)
        alerta.comTexto(MENSAGENS.produto.nomeEmUso).should('be.visible')
        cy.location('pathname').should('equal', ROTAS.cadastroProduto)
      })
    })
  })

  context('com usuário comum autenticado', () => {
    it('[E2E-PRO-03] deve exibir alerta de rota exclusiva e não cadastrar o produto', () => {
      const produto = gerarProduto()

      // achado: o front deixa o usuário comum abrir esta tela; quem barra é a API
      cy.criarUsuarioViaApi({ administrador: 'false' }).then((usuarioComum) => {
        cy.obterTokenViaApi(usuarioComum).then((token) => {
          cy.visitarAutenticado(ROTAS.cadastroProduto, { usuario: usuarioComum, token })
        })
      })
      cadastroProdutoPagina.cadastrar(produto)

      cy.wait('@cadastrarProduto').its('response.statusCode').should('equal', 403)
      alerta.comTexto(MENSAGENS.autorizacao.somenteAdministrador).should('be.visible')
      cy.location('pathname').should('equal', ROTAS.cadastroProduto)
      produtosServico.listar({ nome: produto.nome }).then((resposta) => {
        expect(resposta.body.quantidade, 'produtos com o nome').to.equal(0)
      })
    })
  })
})
