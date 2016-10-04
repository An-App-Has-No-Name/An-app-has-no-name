
module.exports = function(sequelize, DataTypes) {
  return sequelize.define("score", {
    score: DataTypes.INTEGER,
    username: DataTypes.STRING,
  });
};
