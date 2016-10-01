'use strict';

const bodyParser  = require('body-parser');
const path = require('path');

const publicPath = path.resolve(__dirname, '../../public');

module.exports = function(app, express) {

  const questionRouter = express.Router();

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(publicPath));
  app.use('/api/questions', questionRouter);
  require('./models/questionRoutes')(questionRouter);

};
