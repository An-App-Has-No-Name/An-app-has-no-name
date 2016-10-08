const { signin, signup, signout } = require('../controller/user.controller');

module.exports = (app) => {
  app.post('/signin', signin);
  app.post('/signup', signup);
  app.get('/signout', signout);
}