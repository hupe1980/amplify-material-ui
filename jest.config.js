module.exports = {
  projects: [
    {
      displayName: 'amplify-auth-hooks',
      rootDir: './packages/amplify-auth-hooks',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/tsconfig.dev.json',
        },
      },
    },
    {
      displayName: 'amplify-material-ui',
      rootDir: './packages/amplify-material-ui',
      preset: 'ts-jest',
      testEnvironment: 'jsdom',
      globals: {
        'ts-jest': {
          tsconfig: '<rootDir>/tsconfig.dev.json',
        },
      },
    },
  ],
};
