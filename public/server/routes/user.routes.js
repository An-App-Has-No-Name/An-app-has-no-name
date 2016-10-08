const user = require('../controller/user.controller')

module.exports = (app) => {
  app.post('/signin', user.signin);
  app.post('/signup', user.signup);
}
