export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // a descrição em português pode começar com sigla (API, E2E)
    'subject-case': [0],
  },
}
