// failOnStatusCode: false para o próprio teste validar 400, 401 e 403
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
