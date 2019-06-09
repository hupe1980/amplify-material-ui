module.exports = {
    presets: [['react-app', { flow: false, typescript: true }]],
    env: {
        production: {
            ignore: ['**/__tests__', '**/__stories__'],
            plugins: [
                ['react-remove-properties', { properties: ['data-test'] }],
            ],
        },
    },
};
