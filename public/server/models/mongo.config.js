'use strict';

const MongoClient = require('mongodb');
const assert = require('assert');
const utils = require('./utils');

const MONGODB  = process.env.MONGODB_URI || require('./../config').MONGODB;

const mongodb = MONGODB;

// let categories = ['Entertainment: Music', 'General Knowledge'];
const findDocuments = (db, categoriesList, callback) => {
  const collection = db.collection('questions');
  // const randomC = collection.count()
  // const rand = Math.floor( Math.random() * randomC );

  console.log("this is list of cat", categoriesList)
  collection.find({category: { $in: categoriesList}}).toArray((err, questions) => {
    assert.equal(err, null);
    callback(questions, categoriesList);
  });
};
const findDocumentsRandCat = (db, callback) => {
  const collection = db.collection('questions');
  // const randomC = collection.count()
  // const rand = Math.floor( Math.random() * randomC );
  let categoriesList = utils.getRandomCategories();
  console.log("this is list of cat", categoriesList)
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
}