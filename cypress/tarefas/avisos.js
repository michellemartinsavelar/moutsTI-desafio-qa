import { appendFileSync } from 'node:fs'

// Avisos que não reprovam o teste, mas que eu não quero perder: saem no terminal
// e, no GitHub Actions, também no resumo do job (um log de pipeline verde ninguém abre).
export function avisar(marcador, titulo, mensagens) {
  if (mensagens.length === 0) {
    return
  }

  mensagens.forEach((mensagem) => {
    process.stderr.write(`[${marcador}] ${mensagem}\n`)
  })

  const resumoDoJob = process.env.GITHUB_STEP_SUMMARY

  if (resumoDoJob) {
    const itens = mensagens.map((mensagem) => `- ${mensagem}`).join('\n')

    appendFileSync(resumoDoJob, `### ${titulo}\n\n${itens}\n\n`)
  }
}
