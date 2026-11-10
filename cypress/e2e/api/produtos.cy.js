import produtosServico from '../../support/servicos/produtosServico'
import { gerarProduto } from '../../support/fabricas/produtoFabrica'
import { validarContrato } from '../../support/contratos/validarContrato'
import { MENSAGENS } from '../../support/constantes/mensagens'
import contratoCadastroSucesso from '../../fixtures/contratos/cadastroSucesso.json'
import contratoProduto from '../../fixtures/contratos/produto.json'

describe('API - Produtos', () => {
  let tokenAdministrador

  beforeEach(() => {
    cy.criarUsuarioViaApi()
      .then((administrador) => cy.obterTokenViaApi(administrador))
      .then((token) => {
        tokenAdministrador = token
      })
  })

  it('deve cadastrar um produto como administrador e persistir os dados informados', () => {
    const produto = gerarProduto()

    produtosServico
      .cadastrar(produto, tokenAdministrador)
      .then((resposta) => {
        expect(resposta.status).to.equal(201)
        expect(resposta.body.message).to.equal(MENSAGENS.cadastro.sucesso)
        validarContrato(resposta.body, contratoCadastroSucesso)
        cy.registrarProdutoParaLimpeza(resposta.body._id, tokenAdministrador)

        return produtosServico.buscarPorId(resposta.body._id)
      })
      .then((resposta) => {
        expect(resposta.status).to.equal(200)
        expect(resposta.body).to.include(produto)
        validarContrato(resposta.body, contratoProduto)
      })
  })

  it('não deve cadastrar um produto sem token de autenticação', () => {
    produtosServico.cadastrar(gerarProduto()).then((resposta) => {
      expect(resposta.status).to.equal(401)
      expect(resposta.body.message).to.equal(MENSAGENS.autorizacao.tokenInvalido)
    })
  })

  it('não deve cadastrar um produto com usuário que não é administrador', () => {
    cy.criarUsuarioViaApi({ administrador: 'false' })
      .then((usuarioComum) => cy.obterTokenViaApi(usuarioComum))
      .then((tokenUsuarioComum) => produtosServico.cadastrar(gerarProduto(), tokenUsuarioComum))
      .then((resposta) => {
        expect(resposta.status).to.equal(403)
        expect(resposta.body.message).to.equal(MENSAGENS.autorizacao.somenteAdministrador)
      })
  })

  it('não deve cadastrar um produto com nome já utilizado', () => {
    cy.criarProdutoViaApi(tokenAdministrador)
      .then((produtoExistente) => {
        const produtoComMesmoNome = gerarProduto({ nome: produtoExistente.nome })

        return produtosServico.cadastrar(produtoComMesmoNome, tokenAdministrador)
      })
      .then((resposta) => {
        expect(resposta.status).to.equal(400)
        expect(resposta.body.message).to.equal(MENSAGENS.produto.nomeEmUso)
      })
  })
})
