module.exports = {
    presets: [['react-app', { flow: false, typescript: true }]],
    ignore: ['**/__tests__', '**/__stories__'],
    env: {
        production: {
            plugins: [
                ['react-remove-properties', { properties: ['data-test'] }],
            ],
        },
    },
};
