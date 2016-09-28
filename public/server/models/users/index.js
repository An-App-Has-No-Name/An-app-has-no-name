const Sequelize = require('sequelize');
const { PSQL_DB } = require('./../../config');

const PSQLDB = process.env.DATABASE_URL || PSQL_DB ;
const sequelize = new Sequelize(PSQLDB, {
  native: true,
});

sequelize
.authenticate()
.then(function(err) {
  console.log('Connection to psql db has been established successfully.');
})
.catch(function (err) {
  console.log('Unable to connect to the database:', err);
});


const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  User:  sequelize.import(__dirname + '/user'),
};

module.exports = db;
