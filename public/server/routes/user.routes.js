const { signin, signup } = require('../controller/user.controller');

module.exports = (app) => {
  app.post('/signin', signin);
  app.post('/signup', signup);
}