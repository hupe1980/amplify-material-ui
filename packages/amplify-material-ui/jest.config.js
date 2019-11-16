module.exports = {
    testPathIgnorePatterns: ['/node_modules/', '/lib/'],
    testRegex: '(/tests/.*|\\.(test|spec))\\.(ts|tsx|js)$',
    moduleFileExtensions: ['ts', 'tsx', 'js', 'json'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/index.tsx',
        '!src/dict.tsx',
        '!src/**/__tests__/*',
    ],
};
