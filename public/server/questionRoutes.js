'use strict';
const mongoConfig = require('./mongo.config');
const utils = require('./utils');

module.exports = function(appRoute) {

  appRoute.route('/').get(function(req, res) {
    console.log('making api call');

    let questionList = {};
    mongoConfig.findQuestion((data, categoriesList) => {
      console.log('categoriesList', categoriesList)

      for (let category of categoriesList) {
        if (questionList[category] === undefined) {
          questionList[category] = [];
        }
          questionList[category] = questionList[category].concat(utils.getRandomQuestions(category, data));
      }

      res.send(questionList);
    });
  });
};
