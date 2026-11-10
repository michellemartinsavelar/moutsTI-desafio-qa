import ServicoBase from './servicoBase'

class ProdutosServico extends ServicoBase {
  constructor() {
    super('produtos')
  }

  cadastrar(produto, token) {
    return this.requisitar({ metodo: 'POST', corpo: produto, token })
  }

  listar(filtros) {
    return this.requisitar({ metodo: 'GET', filtros })
  }

  buscarPorId(id) {
    return this.requisitar({ metodo: 'GET', caminho: `/${id}` })
  }

  excluir(id, token) {
    return this.requisitar({ metodo: 'DELETE', caminho: `/${id}`, token })
  }
}

export default new ProdutosServico()
