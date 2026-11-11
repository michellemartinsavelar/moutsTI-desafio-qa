/**
 * Registra tudo o que os testes criam no ambiente para remover ao final de cada teste.
 * Assim cada teste é independente e o ambiente público do ServeRest não acumula lixo.
 *
 * O Cypress empacota o support e cada spec separadamente, então este módulo é
 * carregado mais de uma vez. O registro fica em um único objeto no escopo global
 * da página de teste, para que todas as cópias do módulo enxerguem a mesma massa.
 */
const massaRegistrada = (globalThis.massaDeTeste ??= { usuarios: [], produtos: [] })

export function registrarUsuario(id) {
  if (id) {
    massaRegistrada.usuarios.push(id)
  }
}

export function registrarProduto(id) {
  if (id) {
    massaRegistrada.produtos.push(id)
  }
}

/**
 * Entrega a massa registrada para a tarefa de limpeza, que roda no Node e trata
 * cada exclusão separadamente (veja cypress/tarefas/limparMassa.js).
 */
export function limparMassa() {
  const massa = {
    usuarios: massaRegistrada.usuarios,
    produtos: massaRegistrada.produtos,
  }

  massaRegistrada.usuarios = []
  massaRegistrada.produtos = []

  if (massa.usuarios.length === 0 && massa.produtos.length === 0) {
    return
  }

  cy.task('limparMassa', { apiUrl: Cypress.expose('apiUrl'), ...massa })
}
