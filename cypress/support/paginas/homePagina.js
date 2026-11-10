class HomePagina {
  seletores = {
    titulo: 'h1',
    botaoLogout: '[data-testid="logout"]',
  }

  titulo() {
    return cy.get(this.seletores.titulo)
  }

  botaoLogout() {
    return cy.get(this.seletores.botaoLogout)
  }
}

export default new HomePagina()
