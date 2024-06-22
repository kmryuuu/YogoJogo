module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['react-refresh', 'prettier'],
  rules: {
    'prettier/prettier': 'error', // prettier 포멧팅 에러 표시
    'react/react-in-jsx-scope': 'off', // React를 명시적으로 import할 필요가 없으므로 규칙 비활성화
    '@typescript-eslint/no-unused-vars': ['warn', { varsIgnorePattern: 'React' }], // 사용되지 않는 변수가 있을 경우 경고
    '@typescript-eslint/no-explicit-any': 'off', // 'any' 타입 사용 금지
    'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
  },
};
