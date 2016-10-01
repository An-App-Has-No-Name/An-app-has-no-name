'use strict';
const bodyParser  = require('body-parser');
const morgan  = require('morgan');
const path = require('path');

const publicPath = path.resolve(__dirname, '../../../public');

module.exports = function(app, express) {

  const questionRouter = express.Router();
  const userRouter = express.Router();

  app.use(morgan('dev'));
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  app.use(express.static(publicPath));

  app.use('/api/questions', questionRouter);
  app.use('/users', userRouter);
  require('../routes/question.routes')(questionRouter);
  require('../routes/user.routes')(userRouter);
};
