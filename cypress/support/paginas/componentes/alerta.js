class Alerta {
  comTexto(texto) {
    return cy.contains('.alert', texto)
  }
}

export default new Alerta()
