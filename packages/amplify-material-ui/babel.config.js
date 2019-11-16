module.exports = {
    presets: [
        [
            'react-app',
            { flow: false, typescript: true, absoluteRuntime: false },
        ],
    ],
    plugins: ['optimize-clsx'],
    env: {
        production: {
            plugins: [
                'dev-expression',
                ['react-remove-properties', { properties: ['data-testid'] }],
            ],
        },
    },
};
