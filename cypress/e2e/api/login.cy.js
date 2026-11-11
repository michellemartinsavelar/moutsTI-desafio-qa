import loginServico from '../../support/servicos/loginServico'
import produtosServico from '../../support/servicos/produtosServico'
import { gerarUsuario } from '../../support/fabricas/usuarioFabrica'
import { gerarProduto } from '../../support/fabricas/produtoFabrica'
import { validarContrato } from '../../support/contratos/validarContrato'
import { MENSAGENS } from '../../support/constantes/mensagens'
import contratoLoginSucesso from '../../fixtures/contratos/loginSucesso.json'

describe('API | Login - POST /login', () => {
  context('com credenciais válidas', () => {
    it('[API-LOG-01] deve retornar 200 com um token de acesso aceito em rota protegida', () => {
      cy.criarUsuarioViaApi({ administrador: 'true' }).then((administrador) => {
        loginServico.autenticar(administrador).then((resposta) => {
          expect(resposta.status).to.equal(200)
          expect(resposta.body.message).to.equal(MENSAGENS.login.sucesso)
          validarContrato(resposta.body, contratoLoginSucesso)

          // o token só vale se uma rota protegida aceitar
          produtosServico
            .cadastrar(gerarProduto(), resposta.body.authorization)
            .its('status')
            .should('equal', 201)
        })
      })
    })
  })

  context('com credenciais inválidas', () => {
    it('[API-LOG-02] deve retornar 401 quando a senha estiver incorreta', () => {
      cy.criarUsuarioViaApi().then((usuario) => {
        loginServico
          .autenticar({ email: usuario.email, password: 'senhaIncorreta' })
          .then((resposta) => {
            expect(resposta.status).to.equal(401)
            expect(resposta.body.message).to.equal(MENSAGENS.login.credenciaisInvalidas)
            expect(resposta.body).not.to.have.property('authorization')
          })
      })
    })

    it('[API-LOG-03] deve retornar 401 quando o e-mail não estiver cadastrado', () => {
      const usuarioNaoCadastrado = gerarUsuario()

      loginServico.autenticar(usuarioNaoCadastrado).then((resposta) => {
        expect(resposta.status).to.equal(401)
        expect(resposta.body.message).to.equal(MENSAGENS.login.credenciaisInvalidas)
        expect(resposta.body).not.to.have.property('authorization')
      })
    })
  })

  context('com campos obrigatórios não preenchidos', () => {
    const casos = [
      {
        id: 'API-LOG-04',
        condicao: 'e-mail e senha não forem enviados',
        credenciais: {},
        errosEsperados: {
          email: 'email é obrigatório',
          password: 'password é obrigatório',
        },
      },
      {
        id: 'API-LOG-05',
        condicao: 'e-mail e senha estiverem em branco',
        credenciais: { email: '', password: '' },
        errosEsperados: {
          email: 'email não pode ficar em branco',
          password: 'password não pode ficar em branco',
        },
      },
    ]

    casos.forEach(({ id, condicao, credenciais, errosEsperados }) => {
      it(`[${id}] deve retornar 400 quando ${condicao}`, () => {
        loginServico.autenticar(credenciais).then((resposta) => {
          expect(resposta.status).to.equal(400)
          expect(resposta.body).to.deep.equal(errosEsperados)
        })
      })
    })
  })
})
