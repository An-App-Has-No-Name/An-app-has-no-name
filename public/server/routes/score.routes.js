const ScoreController = require('../controller/score.controller');


module.exports = (app) => {
  app.post('/save', ScoreController.saveScore);
  app.get('/leaderboard', ScoreController.getLeaderboard);
};
