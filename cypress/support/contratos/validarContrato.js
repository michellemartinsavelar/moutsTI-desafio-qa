import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

/**
 * Valida o corpo de uma resposta contra um JSON Schema (teste de contrato).
 * Em caso de falha, a mensagem lista todos os campos fora do contrato.
 */
export function validarContrato(corpo, schema) {
  const validar = ajv.compile(schema)
  const valido = validar(corpo)

  expect(valido, `contrato válido ${ajv.errorsText(validar.errors)}`).to.equal(true)
}
