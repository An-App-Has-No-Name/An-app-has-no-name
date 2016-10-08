const { User } = require('../models/psql.config');
const jwt  = require('jwt-simple');

module.exports = {
  signup: (req, res) => { //
    console.log("signup check fro server");
    User.sync()
    .then((User) => {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.json({ data: "All fields are required." });
      }
      User.findOrCreate({ where: { username }, defaults: { password }})
      .spread(function(user, created) {
        if (created) {
          const token = jwt.encode(user, 'secret');
          user.update({token, token})
            .then(() => {
              res.status(200).send({token, username, id: user.id, data: "You have been signed up!"});
            });
        } else {
          console.log("sdsfsdfwelrwerwerwerwe");
          console.log("sdsfsdfwelrwerwerwerwe");
          console.log("sdsfsdfwelrwerwerwerwe");
          res.status(422).send({error: "Oops! Username already exists!"});
        }
      })
      // .catch((error)=>{
      //   console.log(error, 'error');
      //   res.status(422).send({error});
      // })
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
    console.log('You have been logged out');
    res.sendFile(path.resolve(__dirname, '../', 'index.html'));
  },
}


  // checkAuth: function (req, res, next) {
  //   var token = req.headers['x-access-token'];
  //   if (!token) {
  //     next(new Error('No token'));
  //   } else {
  //     var user = jwt.decode(token, 'secret');
  //     var findUser = Q.nbind(User.findOne, User);
  //     findUser({username: user.username})
  //       .then(function (foundUser) {
  //         if (foundUser) {
  //           res.status(200).send();
  //         } else {
  //           res.status(401).send();
  //         }
  //       })
  //       .fail(function (error) {
  //         next(error);
  //       });
  //   }
  // }
