import { fakerPT_BR as faker } from '@faker-js/faker'

/**
 * Gera os dados de um produto válido para o ServeRest.
 * O sufixo aleatório no nome evita conflito com a regra de nome único da API.
 *
 * @param {object} [sobrescritas] campos que devem substituir os valores gerados
 */
export function gerarProduto(sobrescritas = {}) {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
    preco: faker.number.int({ min: 1, max: 5000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
    ...sobrescritas,
  }
}
