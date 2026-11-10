import { fakerPT_BR as faker } from '@faker-js/faker'

/**
 * Gera os dados de um usuário válido para o ServeRest.
 * O e-mail usa UUID para não colidir com outros usuários do ambiente público.
 *
 * @param {object} [sobrescritas] campos que devem substituir os valores gerados
 */
export function gerarUsuario(sobrescritas = {}) {
  return {
    nome: faker.person.fullName(),
    email: `qa.${faker.string.uuid()}@teste.com.br`,
    password: faker.internet.password({ length: 12 }),
    administrador: 'true',
    ...sobrescritas,
  }
}
