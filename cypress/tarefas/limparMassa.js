import { randomUUID } from 'node:crypto'
import { MENSAGENS } from '../support/constantes/mensagens.js'

// Limpeza da massa, rodando no Node (cy.task) e não na fila de comandos do Cypress.
// Assim cada exclusão é tratada sozinha: se uma falhar ou der timeout, vira um
// aviso e as outras continuam.

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

// Produto só pode ser excluído por administrador. Crio um só para a limpeza,
// porque o token do teste pode ser de um usuário sem permissão.
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

// devolve o texto da pendência, ou null se excluiu
async function excluir(url, descricao, token) {
  try {
    const { status, corpo } = await requisitar(url, { metodo: 'DELETE', token })

    // a API responde 200 mesmo sem excluir nada, então confiro a mensagem
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

  // produtos antes dos usuários: o administrador de limpeza é apagado por último
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
