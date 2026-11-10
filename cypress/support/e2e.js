// Arquivo carregado automaticamente antes de cada spec.
import './comandos/api'
import { limparMassa } from './massa/gerenciadorDeMassa'

afterEach(() => {
  limparMassa()
})
