'user strict';
import {
  GET_USER_INFO,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  SIGNIN_SUCCESS,
  SIGNIN_FAILURE,
  AUTH_USER,
  UNAUTH_USER,
  USER_INFO
} from '../constants/index';


export default function(state = {}, action) {
  switch(action.type) {
    
    // case SIGNUP_SUCCESS:
    //   return { ...state, signup: true, error: {}, username: action.payload.username  };
    case SIGNUP_FAILURE:
      return { ...state, signup: false, error: { signup: action.payload } };
    // case SIGNIN_SUCCESS:
    //   return { ...state, signin: true, error: {} };
    case SIGNIN_FAILURE:
      return { ...state, error: { signin: action.payload } };
    case AUTH_USER:
      return { ...state, authenticated: true, error: {}, username: action.payload.username };
    case UNAUTH_USER:
      return { ...state, authenticated: false, error: {} };
    case GET_USER_INFO:
      console.log(action.payload, 'sdlkjfldksjfdl');
      return { ...state, userinfo: action.payload, error: {}}
  }

  return state;
}

