class ListagemProdutosPagina {
  // A tabela não possui data-testid: as células são localizadas pela ordem das colunas
  colunas = {
    nome: 0,
    preco: 1,
    descricao: 2,
    quantidade: 3,
  }

  linhaDoProduto(nomeDoProduto) {
    return cy.contains('tbody tr', nomeDoProduto)
  }

  celulaDoProduto(nomeDoProduto, coluna) {
    return this.linhaDoProduto(nomeDoProduto).find('td').eq(this.colunas[coluna])
  }
}

export default new ListagemProdutosPagina()
