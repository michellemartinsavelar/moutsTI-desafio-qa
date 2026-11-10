import usuariosServico from '../../support/servicos/usuariosServico'
import { gerarUsuario } from '../../support/fabricas/usuarioFabrica'
import { validarContrato } from '../../support/contratos/validarContrato'
import { MENSAGENS } from '../../support/constantes/mensagens'
import contratoCadastroSucesso from '../../fixtures/contratos/cadastroSucesso.json'
import contratoUsuario from '../../fixtures/contratos/usuario.json'

describe('API | Cadastro de usuário - POST /usuarios', () => {
  context('com dados válidos', () => {
    it('[API-USU-01] deve retornar 201 e persistir o usuário com os dados informados', () => {
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
  })

  context('com e-mail já cadastrado', () => {
    it('[API-USU-02] deve retornar 400 informando que o e-mail já está em uso', () => {
      cy.criarUsuarioViaApi().then((usuarioExistente) => {
        const usuarioComMesmoEmail = gerarUsuario({ email: usuarioExistente.email })

        usuariosServico.cadastrar(usuarioComMesmoEmail).then((resposta) => {
          expect(resposta.status).to.equal(400)
          expect(resposta.body.message).to.equal(MENSAGENS.usuario.emailEmUso)
        })

        // Efeito colateral: o cadastro recusado não pode ter criado um segundo usuário
        usuariosServico.listar({ email: usuarioExistente.email }).then((resposta) => {
          expect(resposta.body.quantidade, 'usuários com o e-mail').to.equal(1)
        })
      })
    })
  })

  context('com dados inválidos', () => {
    const casos = [
      {
        id: 'API-USU-03',
        condicao: 'o nome estiver em branco',
        campo: 'nome',
        valor: '',
        mensagem: 'nome não pode ficar em branco',
      },
      {
        id: 'API-USU-04',
        condicao: 'o e-mail tiver formato inválido',
        campo: 'email',
        valor: 'email-sem-arroba.com',
        mensagem: 'email deve ser um email válido',
      },
      {
        id: 'API-USU-05',
        condicao: 'a senha estiver em branco',
        campo: 'password',
        valor: '',
        mensagem: 'password não pode ficar em branco',
      },
      {
        id: 'API-USU-06',
        condicao: 'o perfil de administrador for diferente de "true" ou "false"',
        campo: 'administrador',
        valor: 'sim',
        mensagem: "administrador deve ser 'true' ou 'false'",
      },
    ]

    casos.forEach(({ id, condicao, campo, valor, mensagem }) => {
      it(`[${id}] deve retornar 400 quando ${condicao}`, () => {
        const usuario = gerarUsuario({ [campo]: valor })

        usuariosServico.cadastrar(usuario).then((resposta) => {
          expect(resposta.status).to.equal(400)
          expect(resposta.body).to.deep.equal({ [campo]: mensagem })
        })
      })
    })
  })
})
