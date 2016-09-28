'use strict';
const _ = require('lodash');

module.exports = {

  randomize: (array, amount) => {
    return _.shuffle(array).slice(0, amount);
  },

  categoriesList:  [
    'General Knowledge',
    'Entertainment: Books',
    'Entertainment: Film',
    'Entertainment: Music',
    'Entertainment: Television',
    'Entertainment: Video Games',
    'Entertainment: Board Games',
    'Entertainment: Japanese Anime & Manga',
    'Entertainment: Cartoon & Animations',
    'Science & Nature',
    'Science: Computers',
    'Science: Mathematics',
    'Mythology',
    'Sports',
    'Geography',
    'History',
    'Politics',
    'Art',
    'Celebrities',
    'Animals',
    'Vehicles',
  ],

  getRandomCategories: () => {
    return module.exports.randomize(module.exports.categoriesList, 5);
  },

  getRandomQuestions: (cate, questions) => {

    let result = [];
    const questionsList = _.filter(questions, function(question) {
      return question.category === cate;
    });

    const easyQuestion = _.filter(questionsList, function(question) {
      return question.difficulty === 'easy';
    });

    const hardQuestion = _.filter(questionsList, function(question) {
      return question.difficulty === 'hard';
    });

    const mediumQuestion = _.filter(questionsList, function(question) {
      return question.difficulty === 'medium';
    });

    let easy = module.exports.randomize(easyQuestion, 2);
    let medium = module.exports.randomize(mediumQuestion, 2);
    let hard = module.exports.randomize(hardQuestion, 1);

    if (hard === null) {
      hard = mediumQuestion;
      hard[2].difficulty = 500;
    }

    result = result.concat(easy, medium, hard);

    let difficultyScore = 0;
    result.map(question => {
      question.difficulty = (difficultyScore += 100);
      question.clicked = false;
    });
    return result;
  }
};
