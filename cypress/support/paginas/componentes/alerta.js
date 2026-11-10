/** Alertas de sucesso e de erro exibidos pelo front após as ações do usuário. */
class Alerta {
  comTexto(texto) {
    return cy.contains('.alert', texto)
  }
}

export default new Alerta()
