const { saveScore, getLeaderboard } = require('../controller/score.controller');

module.exports = (app) => {
  app.post('/save', saveScore);
  app.get('/get/leaderboard', getLeaderboard);
}