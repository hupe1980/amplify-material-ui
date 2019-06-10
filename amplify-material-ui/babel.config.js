module.exports = {
    presets: [
        [
            'react-app',
            { flow: false, typescript: true, absoluteRuntime: false },
        ],
    ],
    // env: {
    //     production: {
    //         plugins: [
    //             ['react-remove-properties', { properties: ['data-testid'] }],
    //         ],
    //     },
    // },
};
