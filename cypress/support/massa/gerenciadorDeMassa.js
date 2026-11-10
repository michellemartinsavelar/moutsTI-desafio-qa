import usuariosServico from '../servicos/usuariosServico'
import produtosServico from '../servicos/produtosServico'

/**
 * Registra tudo o que os testes criam no ambiente para remover ao final de cada teste.
 * Assim cada teste é independente e o ambiente público do ServeRest não acumula lixo.
 */
let usuariosCriados = []
let produtosCriados = []

export function registrarUsuario(id) {
  usuariosCriados.push(id)
}

export function registrarProduto(id, token) {
  produtosCriados.push({ id, token })
}

export function limparMassa() {
  // Produtos primeiro: a exclusão exige o token do administrador que os criou
  produtosCriados.forEach(({ id, token }) => produtosServico.excluir(id, token))
  usuariosCriados.forEach((id) => usuariosServico.excluir(id))

  produtosCriados = []
  usuariosCriados = []
}
