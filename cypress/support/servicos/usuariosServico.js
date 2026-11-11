import ServicoBase from './servicoBase'
import { registrarUsuario } from '../massa/gerenciadorDeMassa'

class UsuariosServico extends ServicoBase {
  constructor() {
    super('usuarios')
  }

  cadastrar(usuario) {
    return this.requisitar({ metodo: 'POST', corpo: usuario }).then((resposta) => {
      // Registra para limpeza antes de qualquer assertiva do teste, inclusive
      // quando a API cria um usuário que deveria ter recusado
      registrarUsuario(resposta.body?._id)

      return resposta
    })
  }

  listar(filtros) {
    return this.requisitar({ metodo: 'GET', filtros })
  }

  buscarPorId(id) {
    return this.requisitar({ metodo: 'GET', caminho: `/${id}` })
  }

  excluir(id) {
    return this.requisitar({ metodo: 'DELETE', caminho: `/${id}` })
  }
}

export default new UsuariosServico()
