/**
 * Registra tudo o que os testes criam no ambiente para remover ao final de cada teste.
 * Assim cada teste é independente e o ambiente público do ServeRest não acumula lixo.
 */
let usuariosCriados = []
let produtosCriados = []

export function registrarUsuario(id) {
  usuariosCriados.push(id)
}

export function registrarProduto(id) {
  produtosCriados.push(id)
}

/**
 * Entrega a massa registrada para a tarefa de limpeza, que roda no Node e trata
 * cada exclusão separadamente (veja cypress/tarefas/limparMassa.js).
 */
export function limparMassa() {
  const massa = { usuarios: usuariosCriados, produtos: produtosCriados }

  usuariosCriados = []
  produtosCriados = []

  if (massa.usuarios.length === 0 && massa.produtos.length === 0) {
    return
  }

  cy.task('limparMassa', { apiUrl: Cypress.expose('apiUrl'), ...massa })
}
