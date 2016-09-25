'use strict';
const mongoConfig = require('./mongo.config');
const utils = require('./utils');

module.exports = function(appRoute) {

  appRoute.route('/').get(function(req, res) {
    let questionList = {};
    mongoConfig.findQuestionRandCat((data, categoriesList) => {
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
  
  appRoute.route('/:cat1/:cat2/:cat3/:cat4/:cat5/').get(function(req, res) {

    const categoriesList = [];
    for (let key of Object.keys(req.params)) {
      categoriesList.push(req.params[key]);
    }
    console.log(categoriesList);
    let questionList = {};

    mongoConfig.findQuestion(categoriesList, (data) => {
      console.log('categoriesList', categoriesList)

      for (let category of categoriesList) {
        if (questionList[category] === undefined) {
          questionList[category] = [];
        }
        questionList[category] = questionList[category].concat(utils.getRandomQuestions(category, data));
        console.log(questionList[category]);
      }

      res.send(questionList);
    });
  });
};
