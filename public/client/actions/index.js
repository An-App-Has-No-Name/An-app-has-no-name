'use strict';

import axios from 'axios';
import { browserHistory } from 'react-router';
import { CHANGE_SCORE, DECREMENT_SCORE, FETCH_QUESTIONS, FETCH_QUESTIONS_RANDOM, INCREMENT_SCORE, QUESTION_SELECTED, LOGIN_USER_REQUEST, FETCH_MULTI_QUESTIONS, SIGNUP_SUCCESS, UNAUTH_USER, RESET_QUESTION, USER_INFO, SCORE_SAVE_SUCCESS, FETCH_LEADERBOARD } from '../constants/index';

// export function getUserInfo() {
//   return {
//     type: USER_INFO,
//   }
// }
// export function saveUserInfo(userInfo) {
//   return {
//     type: USER_INFO,
//     payload: userInfo
//   }
// }
export function getLeaderboard() {
  const url = `/scores/leaderboard`;
  const serverResponse = axios.get(url)
    .then((response) => {
      console.log(response, "Here is the leaderboard...");
      return {
        type: FETCH_LEADERBOARD,
        payload:response
      }
    })
    .catch(function (error) {
    console.log(error);
  });
  return serverResponse;
}

export function saveScore(props) {
  const url = `/scores/save`;
  const serverResponse = axios.post(url, props)
    .then((response) => {
      return {
        type: SCORE_SAVE_SUCCESS,
        payload:response
      }
    })
    .catch(function (error) {
    console.log(error);
  });
  return serverResponse;
}

export function checkLogin(props) {
  const url = `/users/signin`;
  const serverResponse = axios.post(url, props)
    .then((response) => {
      const username = response.data.username;
      const id = response.data.id;
      const userInfo = {username, id}
      localStorage.setItem('user', JSON.stringify(response.data.token));
      localStorage.setItem('username', username);
      localStorage.setItem('id', id);
      return {
        type: LOGIN_USER_REQUEST,
        payload:response
      }
    })
    .catch(function (error) {
    console.log(error);
  });
  return serverResponse;
}

export function signupUser(props) {
  const url = `/users/signup`;
  const serverResponse = axios.post(url, props)
    .then((response) => {
      localStorage.setItem('user', JSON.stringify(response.data.token));
      return {
        type: SIGNUP_SUCCESS,
        payload:response
      }
    })
    .catch(function (error) {
    console.log(error);
  });
  return serverResponse;
}


export function signoutUser() {
  localStorage.clear();

  return {
    type: UNAUTH_USER,
  }
}
// export function signoutUser(props) {
//   const url = `/users/signout`;
//   const token = localStorage.getItem('user');
//   console.log(token);
//   localStorage.clear();
//   const serverResponse = axios.post(url, {token})
//     .then((response) => {
//       return {
//         type: UNAUTH_USER,
//         payload:response
//       }
//     })
//     .catch(function (error) {
//     console.log(error);
//   });
//   return serverResponse;
// }

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

export const resetQuestion = () => {
  return {
    type: RESET_QUESTION,
    payload: null
  };
};
