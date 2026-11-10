export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Descrições em português podem começar com sigla ou nome próprio (ex.: "API", "E2E")
    'subject-case': [0],
  },
}
