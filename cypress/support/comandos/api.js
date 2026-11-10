import { gerarUsuario } from '../fabricas/usuarioFabrica'
import { gerarProduto } from '../fabricas/produtoFabrica'
import loginServico from '../servicos/loginServico'
import usuariosServico from '../servicos/usuariosServico'
import produtosServico from '../servicos/produtosServico'
import { registrarProduto, registrarUsuario } from '../massa/gerenciadorDeMassa'

/**
 * Comandos de pré-condição: preparam a massa via API, que é mais rápida e estável
 * que a interface. Falham cedo se a pré-condição não for atendida.
 */

Cypress.Commands.add('criarUsuarioViaApi', (sobrescritas = {}) => {
  const usuario = gerarUsuario(sobrescritas)

  return usuariosServico.cadastrar(usuario).then((resposta) => {
    expect(resposta.status, 'pré-condição: cadastrar usuário').to.eq(201)
    registrarUsuario(resposta.body._id)

    return { ...usuario, _id: resposta.body._id }
  })
})

Cypress.Commands.add('obterTokenViaApi', ({ email, password }) => {
  return loginServico.autenticar({ email, password }).then((resposta) => {
    expect(resposta.status, 'pré-condição: autenticar usuário').to.eq(200)

    return resposta.body.authorization
  })
})

Cypress.Commands.add('criarProdutoViaApi', (token, sobrescritas = {}) => {
  const produto = gerarProduto(sobrescritas)

  return produtosServico.cadastrar(produto, token).then((resposta) => {
    expect(resposta.status, 'pré-condição: cadastrar produto').to.eq(201)
    registrarProduto(resposta.body._id, token)

    return { ...produto, _id: resposta.body._id }
  })
})

/**
 * Registro de massa criada diretamente pelos specs.
 * Precisa ser um comando porque o Cypress empacota o support e cada spec
 * separadamente: um import direto do gerenciador no spec usaria outra instância
 * do módulo, e o afterEach global não enxergaria o registro.
 */
Cypress.Commands.add('registrarUsuarioParaLimpeza', (id) => {
  registrarUsuario(id)
})

Cypress.Commands.add('registrarProdutoParaLimpeza', (id, token) => {
  registrarProduto(id, token)
})
