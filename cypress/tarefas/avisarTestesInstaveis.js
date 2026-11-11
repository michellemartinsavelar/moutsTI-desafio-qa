import { avisar } from './avisos.js'

// os retries do pipeline escondem teste instável; aqui aparece quem só passou na nova tentativa
export function avisarTestesInstaveis(spec, resultados) {
  const instaveis = (resultados?.tests ?? [])
    .filter((teste) => teste.state === 'passed' && teste.attempts.length > 1)
    .map((teste) => `${teste.title.join(' > ')} passou só na tentativa ${teste.attempts.length}`)

  avisar('INSTÁVEL', 'Testes que só passaram após nova tentativa', instaveis)
}
