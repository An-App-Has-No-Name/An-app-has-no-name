const User  = require('../models/psql.config');
const jwt  = require('jwt-simple');

module.exports = {
  signup: (req, res) => { //
    User.sync()
    .then((User) => {
      const username = req.body;
      const password = req.body;
      if (!username || !password) {
        return res.json({ data: "All fields are required." });
      }
      User.findOrCreate({ where: { username }, defaults: { password }})
      .spread(function(user, created) {
        if (created) {
          const token = jwt.encode(user, 'secret');
          user.update({token, token})
            .then(() => {
              res.status(200).json({token, data: "You have been signed up!"});
            });
        } else {
          res.status(422).send({error: "Oops! Username already exists!"});
        }
      });
    });
  },

signin: (req, res) => {  //
    User.sync()
    .then((User) => {
      const { username, password } = req.body;
      User.findOne({ where: { username }})
      .then((user) => {
        user.authenticate(password, (err, match) => {
          if (match) {
            const copyUser = JSON.parse(JSON.stringify(user));
            copyUser.token = '';
            //encode on copy of user with token set to empty. Otherwise the token will keep encoding on the previous token and it gets huge. Might be better to do another update on the user instead.
            const token = jwt.encode(copyUser, 'secret');
            user.update({token, token})
            .then(() => {
              console.log("why is it going int errr too?");
              res.status(200).send({token, username, id: user.id, data:"You have been logged in!"});
            });
          } else {
            console.log("why is it going int errr too?");
            res.status(422).send({error:"Oops! Email or password isn't right"});
          }
        })
      });
    });
  },

  signout: (req, res) => {
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
  },