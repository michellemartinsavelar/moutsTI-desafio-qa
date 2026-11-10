import ServicoBase from './servicoBase'

class LoginServico extends ServicoBase {
  constructor() {
    super('login')
  }

  autenticar({ email, password }) {
    return this.requisitar({ metodo: 'POST', corpo: { email, password } })
  }
}

export default new LoginServico()
