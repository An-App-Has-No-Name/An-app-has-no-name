const Sequelize = require('sequelize');
const path = require('path');

const PSQLDB = process.env.DATABASE_URL || require('../config/config').PSQL_DB;

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

const userPath = path.resolve(__dirname, 'user');

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  User:  sequelize.import(userPath),
};

module.exports = db;
