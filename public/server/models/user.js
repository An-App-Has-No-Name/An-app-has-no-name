const bcrypt   = require('bcrypt-nodejs');
const hashPassword = function (user, options, callback) {
  bcrypt.genSalt(10, (err, salt) => {
    if (err) { return callback(err); }

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) { return callback(err); }
      user.password = hash;
      // user.token = salt;
      callback(null, options);
    });
  });
}

const authenticate = function(passwordToCheck, callback) {
  bcrypt.compare(passwordToCheck, this.getDataValue('password'),(err, isMatch) => {
      if(err) {
        return callback(err);
      }
      callback(null, isMatch);
  });
}

const beforeCreate = function(user, options, callback) {
  user.username = user.username.toLowerCase();
  if (user.password) {
    hashPassword(user, options, callback);
  } else {
    return callback(null, options);
  }
}

module.exports = function(sequelize, DataTypes) {
  return sequelize.define("user", {
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    token: DataTypes.TEXT
    // used: DataTypes.BOOLEAN,
    // expires: DataTypes.DATE,
    }, {
    hooks: {
      beforeCreate
    }, 
    instanceMethods: {
      authenticate
    }
  });
}


