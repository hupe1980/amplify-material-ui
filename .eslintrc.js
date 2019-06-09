'use strict';

const baseConfig = require('eslint-config-react-app');
const baseOverrides = Array.isArray(baseConfig.overrides)
    ? baseConfig.overrides
    : [baseConfig.overrides];

module.exports = {
    extends: ['react-app', 'plugin:prettier/recommended'],
    overrides: [
        ...baseOverrides,
        {
            files: ['**/cypress/integration/**/*', '**/cypress/support/**/*'],
            globals: {
                cy: false,
                Cypress: false,
            },
        },
    ],
};
