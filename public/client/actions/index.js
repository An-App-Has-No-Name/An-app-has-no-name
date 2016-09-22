'use strict';

import axios from 'axios';

export function selectQuestion(question) {
  return {
    type: 'QUESTION_SELECTED',
    payload: question
  };
}

export const FETCH_QUESTION = 'FETCH_QUESTION';

export function fetchQuestion(){
  const request = axios.get('/api/questions');
  return {
    type: FETCH_QUESTION,
    payload:request
  };
}

// export function getScore(){
//   return {
//     type: 'GET_SCORE',
//     payload:
//   }
// }
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
