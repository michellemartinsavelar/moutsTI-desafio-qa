import usuariosServico from '../../support/servicos/usuariosServico'
import { gerarUsuario } from '../../support/fabricas/usuarioFabrica'
import { validarContrato } from '../../support/contratos/validarContrato'
import { MENSAGENS } from '../../support/constantes/mensagens'
import contratoCadastroSucesso from '../../fixtures/contratos/cadastroSucesso.json'
import contratoUsuario from '../../fixtures/contratos/usuario.json'

describe('API - Usuários', () => {
  it('deve cadastrar um usuário e persistir os dados informados', () => {
    const usuario = gerarUsuario()

    usuariosServico
      .cadastrar(usuario)
      .then((resposta) => {
        expect(resposta.status).to.equal(201)
        expect(resposta.body.message).to.equal(MENSAGENS.cadastro.sucesso)
        validarContrato(resposta.body, contratoCadastroSucesso)
        cy.registrarUsuarioParaLimpeza(resposta.body._id)

        return usuariosServico.buscarPorId(resposta.body._id)
      })
      .then((resposta) => {
        expect(resposta.status).to.equal(200)
        expect(resposta.body).to.include(usuario)
        validarContrato(resposta.body, contratoUsuario)
      })
  })

  it('não deve cadastrar um usuário com e-mail já utilizado', () => {
    cy.criarUsuarioViaApi().then((usuarioExistente) => {
      const usuarioComMesmoEmail = gerarUsuario({ email: usuarioExistente.email })

      usuariosServico.cadastrar(usuarioComMesmoEmail).then((resposta) => {
        expect(resposta.status).to.equal(400)
        expect(resposta.body.message).to.equal(MENSAGENS.usuario.emailEmUso)
      })
    })
  })

  const dadosInvalidos = [
    {
      campo: 'nome',
      valor: '',
      mensagem: 'nome não pode ficar em branco',
    },
    {
      campo: 'email',
      valor: 'email-sem-arroba.com',
      mensagem: 'email deve ser um email válido',
    },
    {
      campo: 'password',
      valor: '',
      mensagem: 'password não pode ficar em branco',
    },
    {
      campo: 'administrador',
      valor: 'sim',
      mensagem: "administrador deve ser 'true' ou 'false'",
    },
  ]

  dadosInvalidos.forEach(({ campo, valor, mensagem }) => {
    it(`não deve cadastrar um usuário com o campo "${campo}" inválido`, () => {
      const usuario = gerarUsuario({ [campo]: valor })

      usuariosServico.cadastrar(usuario).then((resposta) => {
        expect(resposta.status).to.equal(400)
        expect(resposta.body).to.deep.equal({ [campo]: mensagem })
      })
    })
  })
})
