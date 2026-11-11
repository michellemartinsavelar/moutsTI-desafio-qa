class ListagemProdutosPagina {
  // a tabela não tem data-testid, então pego a célula pela posição da coluna
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
