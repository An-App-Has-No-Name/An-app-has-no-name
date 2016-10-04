const Score  = require('../models/psql.config');

module.exports = {
  saveScore: (req, res) => {
    const score = req.body.score
    const id = req.body.id
    const username = req.body.username
    Score.sync().then((Score) => {
      Score.create({score: score, userId: id, username })
    })
    .then((score) => {
      if (score) {
        res.status(200).json({data: "Your score has been saved!"});
      } else {
        res.status(200).json({data: "Sorry your score was not able to be saved!"});
      }
    })
  },
  getLeaderboard: (req, res) => {
    const scoresToSend = [];
    Score.sync().then((Score) => {
      Score.findAll({order:'score DESC'})
      .then((scores) => {
        if (!scores) {
          res.status(200).json({data: "Sorry we couldn't fetch the scores for you."});
        } else {
          scores.forEach((score, i) => {
            const username = score.dataValues.username;
            const scoreVal = score.dataValues.score;
            const position = i+1;
            scoresToSend.push({position, username, scoreVal});
          });
          return scoresToSend;
        }
      }).then((scoresToSend) => {
        res.status(200).json({scores:scoresToSend, data: "Scores have been successfully fetched."});
      })
    })
  },
}

// db.User.sync().then((User)=>{
//   User.findOne({ where: { username: 'random' }}).then((user)=>{
//     user.getScores().then((scores)=>{
//       console.log('user : ', user.username);
//       scores.forEach((score)=>{console.log(score.dataValues.id, score.dataValues.score);})
//       console.log("THIS BE SCORES");
//     })
//   })
// })
