import { ROTAS } from '../constantes/rotas'

class LoginPagina {
  seletores = {
    email: '[data-testid="email"]',
    senha: '[data-testid="senha"]',
    botaoEntrar: '[data-testid="entrar"]',
  }

  visitar() {
    cy.visit(ROTAS.login)
  }

  realizarLogin({ email, password }) {
    cy.get(this.seletores.email).type(email)
    cy.get(this.seletores.senha).type(password, { log: false })
    this.entrar()
  }

  entrar() {
    cy.get(this.seletores.botaoEntrar).click()
  }
}

export default new LoginPagina()
