import loginServico from '../../support/servicos/loginServico'
import { gerarUsuario } from '../../support/fabricas/usuarioFabrica'
import { validarContrato } from '../../support/contratos/validarContrato'
import { MENSAGENS } from '../../support/constantes/mensagens'
import contratoLoginSucesso from '../../fixtures/contratos/loginSucesso.json'

describe('API - Login', () => {
  context('com usuário cadastrado', () => {
    let usuario

    beforeEach(() => {
      cy.criarUsuarioViaApi().then((usuarioCriado) => {
        usuario = usuarioCriado
      })
    })

    it('deve autenticar com credenciais válidas e retornar o token', () => {
      loginServico.autenticar(usuario).then((resposta) => {
        expect(resposta.status).to.equal(200)
        expect(resposta.body.message).to.equal(MENSAGENS.login.sucesso)
        validarContrato(resposta.body, contratoLoginSucesso)
      })
    })

    it('não deve autenticar com senha incorreta', () => {
      loginServico
        .autenticar({ email: usuario.email, password: 'senhaIncorreta' })
        .then((resposta) => {
          expect(resposta.status).to.equal(401)
          expect(resposta.body.message).to.equal(MENSAGENS.login.credenciaisInvalidas)
          expect(resposta.body).not.to.have.property('authorization')
        })
    })
  })

  it('não deve autenticar com e-mail não cadastrado', () => {
    const usuarioNaoCadastrado = gerarUsuario()

    loginServico.autenticar(usuarioNaoCadastrado).then((resposta) => {
      expect(resposta.status).to.equal(401)
      expect(resposta.body.message).to.equal(MENSAGENS.login.credenciaisInvalidas)
    })
  })

  const camposObrigatorios = [
    {
      cenario: 'e-mail e senha ausentes',
      credenciais: {},
      errosEsperados: {
        email: 'email é obrigatório',
        password: 'password é obrigatório',
      },
    },
    {
      cenario: 'e-mail e senha em branco',
      credenciais: { email: '', password: '' },
      errosEsperados: {
        email: 'email não pode ficar em branco',
        password: 'password não pode ficar em branco',
      },
    },
  ]

  camposObrigatorios.forEach(({ cenario, credenciais, errosEsperados }) => {
    it(`não deve autenticar com ${cenario}`, () => {
      loginServico.autenticar(credenciais).then((resposta) => {
        expect(resposta.status).to.equal(400)
        expect(resposta.body).to.deep.equal(errosEsperados)
      })
    })
  })
})
