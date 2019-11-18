module.exports = {
  plugins: ['optimize-clsx'],
  env: {
    production: {
      plugins: [['react-remove-properties', { properties: ['data-testid'] }]],
    },
  },
};
