import { randomUUID } from 'node:crypto'
import { MENSAGENS } from '../support/constantes/mensagens.js'

/**
 * Limpeza da massa de teste, executada no processo Node do Cypress (cy.task).
 *
 * Rodar fora da fila de comandos do Cypress permite tratar cada exclusão
 * separadamente: um erro HTTP, um timeout ou uma falha de rede vira uma
 * pendência registrada, sem reprovar o teste e sem impedir as demais exclusões.
 */

const TEMPO_LIMITE_MS = 10000

async function requisitar(url, { metodo, corpo, token }) {
  const resposta = await fetch(url, {
    method: metodo,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: token }),
    },
    body: corpo && JSON.stringify(corpo),
    signal: AbortSignal.timeout(TEMPO_LIMITE_MS),
  })

  return { status: resposta.status, corpo: await resposta.json() }
}

/**
 * A exclusão de produtos exige um administrador. A limpeza usa uma credencial
 * própria, e não o token do teste, para conseguir remover também um produto
 * criado indevidamente por um usuário sem permissão.
 */
async function cadastrarAdministradorDeLimpeza(apiUrl) {
  const administrador = {
    nome: 'Limpeza de massa',
    email: `limpeza.${randomUUID()}@teste.com.br`,
    password: randomUUID(),
    administrador: 'true',
  }
  const { status, corpo } = await requisitar(`${apiUrl}/usuarios`, {
    metodo: 'POST',
    corpo: administrador,
  })

  if (!corpo._id) {
    throw new Error(`cadastro do administrador de limpeza respondeu ${status}`)
  }

  return { ...administrador, id: corpo._id }
}

async function autenticar(apiUrl, { email, password }) {
  const { status, corpo } = await requisitar(`${apiUrl}/login`, {
    metodo: 'POST',
    corpo: { email, password },
  })

  if (!corpo.authorization) {
    throw new Error(`login do administrador de limpeza respondeu ${status}`)
  }

  return corpo.authorization
}

/** Devolve a descrição da pendência, ou null quando a exclusão deu certo. */
async function excluir(url, descricao, token) {
  try {
    const { status, corpo } = await requisitar(url, { metodo: 'DELETE', token })

    // A API responde 200 mesmo quando nada é excluído, por isso a mensagem é conferida
    if (corpo.message !== MENSAGENS.exclusao.sucesso) {
      return `${descricao} não foi excluído (${status} - ${corpo.message})`
    }

    return null
  } catch (erro) {
    return `${descricao} não foi excluído (${erro.message})`
  }
}

export async function limparMassa({ apiUrl, usuarios, produtos }) {
  const pendencias = []
  const usuariosParaExcluir = [...usuarios]

  // Produtos primeiro: dependem do administrador de limpeza, que é excluído ao final
  if (produtos.length > 0) {
    try {
      const administrador = await cadastrarAdministradorDeLimpeza(apiUrl)
      usuariosParaExcluir.push(administrador.id)

      const token = await autenticar(apiUrl, administrador)
      const resultados = await Promise.all(
        produtos.map((id) => excluir(`${apiUrl}/produtos/${id}`, `produto ${id}`, token)),
      )
      pendencias.push(...resultados)
    } catch (erro) {
      pendencias.push(`produtos ${produtos.join(', ')} não foram excluídos (${erro.message})`)
    }
  }

  const resultados = await Promise.all(
    usuariosParaExcluir.map((id) => excluir(`${apiUrl}/usuarios/${id}`, `usuário ${id}`)),
  )
  pendencias.push(...resultados)

  const pendenciasReais = pendencias.filter(Boolean)
  pendenciasReais.forEach((pendencia) => {
    process.stderr.write(`[AVISO] Limpeza de massa: ${pendencia}\n`)
  })

  return pendenciasReais
}
