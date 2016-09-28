// module.exports = function(sequelize, DataTypes) {
//   return sequelize.define("user", {
//     id: {
//       type: Sequelize.INTEGER,
//       primaryKey: true,
//       autoIncrement: true
//     },
//     createdAt: {
//       type: Sequelize.DATE
//     },
//     updatedAt: {
//       type: Sequelize.DATE
//     },
//     username: Sequelize.STRING,
//   });
// }

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    username: DataTypes.STRING
  })
}