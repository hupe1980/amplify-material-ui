module.exports = {
    presets: [['react-app', { flow: false, typescript: true }]],
    env: {
        production: {
            plugins: [
                ['react-remove-properties', { properties: ['data-test'] }],
            ],
        },
    },
};
