import 'cypress-mochawesome-reporter/register'
import './comandos/api'
import './comandos/interface'
import { limparMassa } from './massa/gerenciadorDeMassa'

afterEach(() => {
  limparMassa()
})
