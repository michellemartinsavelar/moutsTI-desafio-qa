class ListagemProdutosPagina {
  linhaDoProduto(nome) {
    return cy.contains('tbody tr', nome)
  }
}

export default new ListagemProdutosPagina()
