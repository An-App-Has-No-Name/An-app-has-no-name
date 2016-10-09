'use strict';

import axios from 'axios';
import { browserHistory } from 'react-router';
import { CHANGE_SCORE, DECREMENT_SCORE, FETCH_QUESTIONS, FETCH_QUESTIONS_RANDOM, INCREMENT_SCORE, QUESTION_SELECTED, LOGIN_USER_REQUEST, FETCH_MULTI_QUESTIONS, SIGNUP_SUCCESS, UNAUTH_USER, RESET_QUESTION, USER_INFO, SCORE_SAVE_SUCCESS, SIGNUP_FAILURE, SIGNIN_FAILURE, FETCH_LEADERBOARD,AUTH_USER, SIGNIN_SUCCESS, GET_USER_INFO, OPPONENT_INFO } from '../constants/index';

export function opponentInfo(username, roomId) {
  const opponentInfo = { username, roomId }
  return {
    type: OPPONENT_INFO,
    payload: opponentInfo
  };
}

export function saveUserInfo(username, roomId) {
  const userInfo = { username, roomId }
  return {
    type: USER_INFO,
    payload: userInfo
  };
}

export function getLeaderboard() {
  const url = `/scores/get/leaderboard`;
  return function(dispatch) {
    axios.get(url)
    .then((response) => {
      dispatch({
        type: FETCH_LEADERBOARD,
        payload:response
      });
    })
    .catch(function (error) {
      // console.log(error);
    });
  }
}

export function saveScore(props) {
  const url = `/scores/save`;
  return function(dispatch) {
    axios.post(url, props)
      .then((response) => {
        dispatch({
          type: SCORE_SAVE_SUCCESS,
          payload:response
        });
      })
      .catch(function (error) {
      // console.log(error);
    });
  }
}

export function authError(CONST, error) {
  return {
    type: CONST,
    payload: error,
  };
}

export function signinUser(props) {
  const url = `/users/signin`;
  return function (dispatch) {
    axios.post(url, props)
      .then((response) => {
        const username = response.data.username;
        const id = response.data.id;
        localStorage.setItem('user', response.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('id', id);
        dispatch({
          type: AUTH_USER ,
          payload: { username }
        });
        browserHistory.push('/');
      })
      .catch((response) => dispatch(authError(SIGNIN_FAILURE, response.response.data.error)));
  }
}

export function signupUser(props) {
  const url = `/users/signup`;
  return function (dispatch) {
    axios.post(url, props)
      .then((response) => {
        const username = response.data.username;
        const id = response.data.id;
        localStorage.setItem('user', response.data.token);
        localStorage.setItem('username', username);
        localStorage.setItem('id', id);
        dispatch({
          type: AUTH_USER,
          payload: { username }
        });
        browserHistory.push('/');
      })
      .catch((response) => {
        dispatch(authError(SIGNUP_FAILURE, response.response.data.error));
      });
  }
}

export function signoutUser() {
  localStorage.clear();
  browserHistory.push('/')
  return {
    type: UNAUTH_USER,
  }
}

export function selectQuestion(question) {
  return {
    type: QUESTION_SELECTED,
    payload: question
  }
}
export function fetchQuestionsRandCat(){
  return function (dispatch) {
    axios.get('/api/questions').then((response) => {
      dispatch({
        type: FETCH_QUESTIONS_RANDOM,
        payload:response
      });
    })
  }
}

export function fetchQuestions(categories){
  const url = `/api/questions/${categories[0]}/${categories[1]}/${categories[2]}/${categories[3]}/${categories[4]}`;
  return function (dispatch) {
    axios.get(url).then((response) => {
      dispatch({
        type: FETCH_QUESTIONS,
        payload:response
      });
    })
  }
}

export function fetchQuestionsMultiplayer(questions) {

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
  return {
    type: INCREMENT_SCORE,
    roomId: roomId,
    score: score,
    difficulty: difficulty,
  };
};

export const decrementScore = (score, difficulty, roomId) => {
  return {
    type: DECREMENT_SCORE,
    roomId: roomId,
    score: score,
    difficulty: difficulty,
  };
};

export const resetQuestion = () => {
  return {
    type: RESET_QUESTION,
    payload: null
  };
};
