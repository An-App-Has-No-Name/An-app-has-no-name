'use strict';

const MongoClient = require('mongodb');
const assert = require('assert');
const utils = require('../config/utils');

const MONGODB  = process.env.MONGODB_URI || require('../config/config').MONGODB;

const mongodb = MONGODB;

const findDocuments = (db, categoriesList, callback) => {
  const collection = db.collection('questions');
  collection.find({category: { $in: categoriesList}}).toArray((err, questions) => {
    assert.equal(err, null);
    callback(questions, categoriesList);
  });
};
const findDocumentsRandCat = (db, callback) => {
  const collection = db.collection('questions');

  let categoriesList = utils.getRandomCategories();
  collection.find({category: { $in: categoriesList}}).toArray((err, questions) => {
    assert.equal(err, null);
    callback(questions, categoriesList);
  });
};

const jeopardy = MongoClient.connection;

module.exports = jeopardy;

module.exports = {
  findQuestion: (categoriesList, callback) => {
    MongoClient.connect(mongodb, (err, db) => {
      assert.equal(null, err);
      findDocuments(db, categoriesList, (data) => {
        callback(data);
        db.close();
      });
    });
  },
  
  findQuestionRandCat: (callback) => {
    MongoClient.connect(mongodb, (err, db) => {
      assert.equal(null, err);
      findDocumentsRandCat(db, (data, categoriesList) => {
        callback(data, categoriesList);
        db.close();
      });
    });
  }
};
