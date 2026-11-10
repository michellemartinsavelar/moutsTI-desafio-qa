import { ROTAS } from '../constantes/rotas'

class CadastroUsuarioPagina {
  seletores = {
    nome: '[data-testid="nome"]',
    email: '[data-testid="email"]',
    senha: '[data-testid="password"]',
    administrador: '[data-testid="checkbox"]',
    botaoCadastrar: '[data-testid="cadastrar"]',
  }

  visitar() {
    cy.visit(ROTAS.cadastroUsuario)
  }

  cadastrar({ nome, email, password, administrador }) {
    cy.get(this.seletores.nome).type(nome)
    cy.get(this.seletores.email).type(email)
    cy.get(this.seletores.senha).type(password, { log: false })

    if (administrador === 'true') {
      cy.get(this.seletores.administrador).check()
    }

    cy.get(this.seletores.botaoCadastrar).click()
  }
}

export default new CadastroUsuarioPagina()
