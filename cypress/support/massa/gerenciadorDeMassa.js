import usuariosServico from '../servicos/usuariosServico'
import produtosServico from '../servicos/produtosServico'
import { MENSAGENS } from '../constantes/mensagens'

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

/**
 * A limpeza não deve reprovar o teste, mas também não pode falhar em silêncio:
 * o aviso aparece no terminal e no log do pipeline.
 * A API responde 200 mesmo quando nada é excluído, por isso a mensagem é conferida.
 */
function avisarSeNaoExcluiu(descricao) {
  return (resposta) => {
    if (resposta.body.message !== MENSAGENS.exclusao.sucesso) {
      cy.task(
        'avisar',
        `Limpeza de massa: ${descricao} não foi excluído (${resposta.status} - ${resposta.body.message})`,
      )
    }
  }
}

export function limparMassa() {
  // Produtos primeiro: a exclusão exige o token do administrador que os criou
  produtosCriados.forEach(({ id, token }) => {
    produtosServico.excluir(id, token).then(avisarSeNaoExcluiu(`produto ${id}`))
  })
  usuariosCriados.forEach((id) => {
    usuariosServico.excluir(id).then(avisarSeNaoExcluiu(`usuário ${id}`))
  })

  produtosCriados = []
  usuariosCriados = []
}
