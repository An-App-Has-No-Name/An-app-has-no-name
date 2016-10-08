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

  getRandomCategories: (max = 5, pickedCat = []) => {
    let filterCategories = _.without(module.exports.categoriesList, ...pickedCat);
    
    if (filterCategories) {
      return module.exports.randomize(filterCategories, max);
    } else {
      return module.exports.randomize(module.exports.categoriesList, max);
    }
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
  },

  randomDouble: function(questionList) {
    const getRandomArbitrary = function(min, max) {
      return Math.floor(Math.random() * (max - min) + min);
    };
    const allCategories =  Object.keys(questionList);
    console.log("random Num", getRandomArbitrary(0, allCategories.length));
    const randCat = allCategories[getRandomArbitrary(0, allCategories.length)];

    const randomQuestion = questionList[randCat][getRandomArbitrary(0, 5)];


    randomQuestion.dailyDouble = randomQuestion.difficulty * 3;

    console.log("dailyDouble", randomQuestion);

    return questionList;
  }
};
