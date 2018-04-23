const { compose } = require('redux');
const withTypescript = require('@zeit/next-typescript');
const withSass = require('@zeit/next-sass');


module.exports = compose(
  withTypescript,
  withSass,
)();
