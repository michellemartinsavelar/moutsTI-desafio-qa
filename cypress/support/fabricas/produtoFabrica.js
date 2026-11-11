import { fakerPT_BR as faker } from '@faker-js/faker'

// o sufixo aleatório evita esbarrar na regra de nome único da API
export function gerarProduto(sobrescritas = {}) {
  return {
    nome: `${faker.commerce.productName()} ${faker.string.alphanumeric(8)}`,
    preco: faker.number.int({ min: 1, max: 5000 }),
    descricao: faker.commerce.productDescription(),
    quantidade: faker.number.int({ min: 1, max: 100 }),
    ...sobrescritas,
  }
}
