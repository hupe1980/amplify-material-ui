module.exports = {
  rootDir: './packages',
  projects: ['<rootDir>'],
  transform: {
    '^.+\\.[t|j]sx?$': 'babel-jest'
  },
  testURL: 'http://localhost',
  testMatch: ['<rootDir>/*/test/**/*.test.ts?(x)'],
  testPathIgnorePatterns: ['node_modules', 'dist']
};
