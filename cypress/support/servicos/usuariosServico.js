import ServicoBase from './servicoBase'

class UsuariosServico extends ServicoBase {
  constructor() {
    super('usuarios')
  }

  cadastrar(usuario) {
    return this.requisitar({ metodo: 'POST', corpo: usuario })
  }

  buscarPorId(id) {
    return this.requisitar({ metodo: 'GET', caminho: `/${id}` })
  }

  excluir(id) {
    return this.requisitar({ metodo: 'DELETE', caminho: `/${id}` })
  }
}

export default new UsuariosServico()
