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
const scorePath = path.resolve(__dirname, 'score');

const User = sequelize.import(userPath);
const Score = sequelize.import(scorePath);

User.hasMany(Score, {as: 'Scores'});

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  User,
  Score,
};

module.exports = db;
