// Guarda os IDs de tudo o que os testes criam, para apagar no final de cada um.
// O Cypress empacota o support e cada spec separadamente, então este arquivo é
// carregado mais de uma vez. Por isso o registro fica no escopo global: assim
// todas as cópias enxergam a mesma lista.
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

// a exclusão em si roda no Node: cypress/tarefas/limparMassa.js
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
