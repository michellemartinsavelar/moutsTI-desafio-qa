import { fakerPT_BR as faker } from '@faker-js/faker'

// e-mail com UUID para não colidir com outros usuários do ambiente público
export function gerarUsuario(sobrescritas = {}) {
  return {
    nome: faker.person.fullName(),
    email: `qa.${faker.string.uuid()}@teste.com.br`,
    password: faker.internet.password({ length: 12 }),
    administrador: 'true',
    ...sobrescritas,
  }
}
