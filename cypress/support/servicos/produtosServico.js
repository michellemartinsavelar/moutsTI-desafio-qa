import ServicoBase from './servicoBase'
import { registrarProduto } from '../massa/gerenciadorDeMassa'

class ProdutosServico extends ServicoBase {
  constructor() {
    super('produtos')
  }

  cadastrar(produto, token) {
    return this.requisitar({ metodo: 'POST', corpo: produto, token }).then((resposta) => {
      // Registra para limpeza antes de qualquer assertiva do teste, inclusive
      // quando a API cria um produto que deveria ter recusado
      registrarProduto(resposta.body?._id)

      return resposta
    })
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
