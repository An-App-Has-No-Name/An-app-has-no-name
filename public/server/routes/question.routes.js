'use strict';
const mongoConfig = require('../models/mongo.config');
const utils = require('../config/utils');
const multiplayer = require('../server');

module.exports = function(appRoute) {

  appRoute.route('/').get((req, res) => {
    let questionList = {};
    mongoConfig.findQuestionRandCat((data, categoriesList) => {
      for (let category of categoriesList) {
        if (questionList[category] === undefined) {
          questionList[category] = [];
        }
          questionList[category] = questionList[category].concat(utils.getRandomQuestions(category, data));
      }
      questionList = utils.randomDouble(questionList);
      res.send(questionList);
    });
  });

  appRoute.route('/:cat1/:cat2/:cat3/:cat4/:cat5/').get((req, res) =>  {

    let categoriesList = [];
    for (let key of Object.keys(req.params)) {
      if (req.params[key] !== 'undefined') {
        categoriesList.push(req.params[key]);
      }
    }

    console.log('lenth casv', categoriesList.length);
    if (categoriesList.length < 5) {
      console.log('checking checking checking', utils.getRandomCategories(5 - categoriesList.length, categoriesList));

      categoriesList = categoriesList.concat(utils.getRandomCategories(5 - categoriesList.length, categoriesList));
    }

    let questionList = {};

    mongoConfig.findQuestion(categoriesList, (data) => {

      for (let category of categoriesList) {
        if (questionList[category] === undefined) {
          questionList[category] = [];
        }
        questionList[category] = questionList[category].concat(utils.getRandomQuestions(category, data));
      }

      questionList = utils.randomDouble(questionList);
      res.send(questionList);
    });
  });


  appRoute.route('/multiplayer').get((req, res) => {

    // multiplayer.giveQuestions((data) => {
    //   console.log('routing', data)
    //   res.send(data);
    // });

    console.log("Sending back from multiplayer");
    res.send('Sending back from multiplayer');

  });
};
