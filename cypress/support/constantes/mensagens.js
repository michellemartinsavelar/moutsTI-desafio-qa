/**
 * Mensagens retornadas pelo ServeRest, centralizadas para que uma mudança
 * de texto na aplicação seja corrigida em um único lugar.
 */
export const MENSAGENS = {
  login: {
    sucesso: 'Login realizado com sucesso',
    credenciaisInvalidas: 'Email e/ou senha inválidos',
  },
  cadastro: {
    sucesso: 'Cadastro realizado com sucesso',
  },
  usuario: {
    emailEmUso: 'Este email já está sendo usado',
  },
  produto: {
    nomeEmUso: 'Já existe produto com esse nome',
  },
  autorizacao: {
    tokenInvalido:
      'Token de acesso ausente, inválido, expirado ou usuário do token não existe mais',
    somenteAdministrador: 'Rota exclusiva para administradores',
  },
}
