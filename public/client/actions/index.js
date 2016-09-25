'use strict';

import axios from 'axios';

const FETCH_QUESTIONS = 'FETCH_QUESTIONS',
      FETCH_QUESTIONS_RANDOM = 'FETCH_QUESTIONS_RANDOM',
      CHANGE_SCORE = 'CHANGE_SCORE',
      INCREMENT_SCORE = 'INCREMENT_SCORE',
      DECREMENT_SCORE = 'DECREMENT_SCORE',
      QUESTION_SELECTED = 'QUESTION_SELECTED';


export function selectQuestion(question) {
  return {
    type: QUESTION_SELECTED,
    payload: question
  };
}
export function fetchQuestionsRandCat(){
  const request = axios.get('/api/questions');
  return {
    type: FETCH_QUESTIONS_RANDOM,
    payload:request
  };
}

export function fetchQuestions(categories){
  console.log(categories[0], "CHECKING CAT");
  const url = '/api/questions/' + categories[0] + '/'+ categories[1] + '/' + categories[2] + '/'+ categories[3] + '/' + categories[4];
  const request = axios.get(url);
  return {
    type: FETCH_QUESTIONS,
    payload:request,
  };
}

// let nextQuestionId = 0
//
// export const addQuestion = question => {
//   return {
//     type: 'ADD_QUESTION',
//     id: nextQuestionId++,
//     question
//   }
// }
//
// export const toggleQuestion = id => {
//   return {
//     type: 'TOGGLE_QUESTION',
//     id
//   }
// }

export const changeScore = (score) => {
  return {
    type: CHANGE_SCORE,
    score: score,
  }
}

export const incrementScore = (score, difficulty) => {
  console.log('THIS IS INCREMENT_SCORE', difficulty);
  return {
    type: INCREMENT_SCORE,
    score: score,
    difficulty: difficulty,
  }
}

export const decrementScore = (score, difficulty) => {
  console.log('THIS IS DECREMENT_SCORE', score, "difficulty:", difficulty);

  return {
    type: DECREMENT_SCORE,
    score: score,
    difficulty: difficulty,
  }
}

export {
  CHANGE_SCORE,
  DECREMENT_SCORE,
  FETCH_QUESTIONS,
  FETCH_QUESTIONS_RANDOM,
  INCREMENT_SCORE,
  QUESTION_SELECTED,
}
