'use strict';

import axios from 'axios';

import { CHANGE_SCORE, DECREMENT_SCORE, FETCH_QUESTIONS, FETCH_QUESTIONS_RANDOM, INCREMENT_SCORE, QUESTION_SELECTED, LOGIN_USER_REQUEST, FETCH_MULTI_QUESTIONS } from '../constants/index';


export function checkLogin(loginInfo) {
  console.log(LOGIN_USER_REQUEST);
  // const url = `/users/${loginInfo.username}/${loginInfo.password}`;
  const url = `/users/${loginInfo.username}/`;
  const request = axios.get(url);
  return {
    type: LOGIN_USER_REQUEST,
    payload:request
  };
}

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
  const url = `/api/questions/${categories[0]}/${categories[1]}/${categories[2]}/${categories[3]}/${categories[4]}`;
  const request = axios.get(url);
  return {
    type: FETCH_QUESTIONS,
    payload:request,
  };
}


export function fetchQuestionsMultiplayer(questions) {

  console.log('fetching from multiplayer', questions)
  return {
    type: FETCH_MULTI_QUESTIONS,
    payload:questions,
  };
}

export const changeScore = (score) => {
  return {
    type: CHANGE_SCORE,
    score: score,
  };
};

export const incrementScore = (score, difficulty, roomId) => {
  console.log('THIS IS INCREMENT_SCORE', difficulty);
  return {
    type: INCREMENT_SCORE,
    roomId: roomId,
    score: score,
    difficulty: difficulty,
  };
};

export const decrementScore = (score, difficulty, roomId) => {
  console.log('THIS IS DECREMENT_SCORE', score, "difficulty:", difficulty);

  return {
    type: DECREMENT_SCORE,
    roomId: roomId,
    score: score,
    difficulty: difficulty,
  };
};
