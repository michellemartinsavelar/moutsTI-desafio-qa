import produtosServico from '../../support/servicos/produtosServico'
import { gerarProduto } from '../../support/fabricas/produtoFabrica'
import { validarContrato } from '../../support/contratos/validarContrato'
import { MENSAGENS } from '../../support/constantes/mensagens'
import contratoCadastroSucesso from '../../fixtures/contratos/cadastroSucesso.json'
import contratoProduto from '../../fixtures/contratos/produto.json'

describe('API | Cadastro de produto - POST /produtos', () => {
  context('com usuário administrador autenticado', () => {
    let tokenAdministrador

    beforeEach(() => {
      cy.criarUsuarioViaApi({ administrador: 'true' })
        .then((administrador) => cy.obterTokenViaApi(administrador))
        .then((token) => {
          tokenAdministrador = token
        })
    })

    it('[API-PRO-01] deve retornar 201 e persistir o produto com os dados informados', () => {
      const produto = gerarProduto()

      produtosServico
        .cadastrar(produto, tokenAdministrador)
        .then((resposta) => {
          expect(resposta.status).to.equal(201)
          expect(resposta.body.message).to.equal(MENSAGENS.cadastro.sucesso)
          validarContrato(resposta.body, contratoCadastroSucesso)
          cy.registrarProdutoParaLimpeza(resposta.body._id)

          return produtosServico.buscarPorId(resposta.body._id)
        })
        .then((resposta) => {
          expect(resposta.status).to.equal(200)
          expect(resposta.body).to.include(produto)
          validarContrato(resposta.body, contratoProduto)
        })
    })

    it('[API-PRO-02] deve retornar 400 quando o nome do produto já estiver em uso', () => {
      cy.criarProdutoViaApi(tokenAdministrador).then((produtoExistente) => {
        const produtoComMesmoNome = gerarProduto({ nome: produtoExistente.nome })

        produtosServico.cadastrar(produtoComMesmoNome, tokenAdministrador).then((resposta) => {
          expect(resposta.status).to.equal(400)
          expect(resposta.body.message).to.equal(MENSAGENS.produto.nomeEmUso)
        })

        // Efeito colateral: o cadastro recusado não pode ter criado um segundo produto
        produtosServico.listar({ nome: produtoExistente.nome }).then((resposta) => {
          expect(resposta.body.quantidade, 'produtos com o nome').to.equal(1)
        })
      })
    })
  })

  context('sem permissão de acesso', () => {
    it('[API-PRO-03] deve retornar 401 quando o token de acesso não for enviado', () => {
      const produto = gerarProduto()

      produtosServico.cadastrar(produto).then((resposta) => {
        expect(resposta.status).to.equal(401)
        expect(resposta.body.message).to.equal(MENSAGENS.autorizacao.tokenInvalido)
      })

      // Efeito colateral: sem autenticação, o produto não pode ter sido criado
      produtosServico.listar({ nome: produto.nome }).then((resposta) => {
        expect(resposta.body.quantidade, 'produtos com o nome').to.equal(0)
      })
    })

    it('[API-PRO-04] deve retornar 403 quando o usuário não for administrador', () => {
      const produto = gerarProduto()

      cy.criarUsuarioViaApi({ administrador: 'false' })
        .then((usuarioComum) => cy.obterTokenViaApi(usuarioComum))
        .then((tokenUsuarioComum) => produtosServico.cadastrar(produto, tokenUsuarioComum))
        .then((resposta) => {
          expect(resposta.status).to.equal(403)
          expect(resposta.body.message).to.equal(MENSAGENS.autorizacao.somenteAdministrador)
        })

      // Efeito colateral: sem permissão, o produto não pode ter sido criado
      produtosServico.listar({ nome: produto.nome }).then((resposta) => {
        expect(resposta.body.quantidade, 'produtos com o nome').to.equal(0)
      })
    })
  })
})
