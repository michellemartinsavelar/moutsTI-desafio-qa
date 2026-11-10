/**
 * Base para os serviços da API: centraliza URL, cabeçalhos e o tratamento de status.
 *
 * `failOnStatusCode: false` deixa o teste decidir qual status é o esperado,
 * o que permite validar cenários negativos (400, 401, 403) com asserções explícitas.
 */
export default class ServicoBase {
  constructor(recurso) {
    this.recurso = recurso
  }

  requisitar({ metodo, caminho = '', corpo, filtros, token }) {
    return cy.request({
      method: metodo,
      url: `${Cypress.expose('apiUrl')}/${this.recurso}${caminho}`,
      body: corpo,
      qs: filtros,
      headers: token ? { Authorization: token } : {},
      failOnStatusCode: false,
    })
  }
}
