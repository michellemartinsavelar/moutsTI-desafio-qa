import Ajv from 'ajv'

const ajv = new Ajv({ allErrors: true })

// valida a resposta contra o JSON Schema e lista o que estiver fora do contrato
export function validarContrato(corpo, schema) {
  const validar = ajv.compile(schema)
  const valido = validar(corpo)

  expect(valido, `contrato válido ${ajv.errorsText(validar.errors)}`).to.equal(true)
}
