import { ROTAS } from '../constantes/rotas'

class CadastroProdutoPagina {
  seletores = {
    nome: '[data-testid="nome"]',
    preco: '[data-testid="preco"]',
    descricao: '[data-testid="descricao"]',
    quantidade: '[data-testid="quantity"]',
    imagem: '[data-testid="imagem"]',
    botaoCadastrar: '[data-testid="cadastarProdutos"]',
  }

  visitar() {
    cy.visit(ROTAS.cadastroProduto)
  }

  cadastrar({ nome, preco, descricao, quantidade }) {
    cy.get(this.seletores.nome).type(nome)
    cy.get(this.seletores.preco).type(preco)
    cy.get(this.seletores.descricao).type(descricao)
    cy.get(this.seletores.quantidade).type(quantidade)
    cy.get(this.seletores.botaoCadastrar).click()
  }
}

export default new CadastroProdutoPagina()
