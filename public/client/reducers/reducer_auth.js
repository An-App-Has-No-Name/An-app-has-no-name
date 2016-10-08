'user strict';
import {
  SIGNUP_SUCCESS,
  AUTH_USER,
  UNAUTH_USER,
} from '../constants/index';

export default function(state = null, action) {
  switch(action.type) {
    // case LOGIN_USER_REQUEST:
    // console.log(LOGIN_USER_REQUEST);
    // if(action.payload.data){
    //   console.log(action.payload.data, 'Login check returned from server');
    //   return action.payload.data;
    // }
    case SIGNUP_SUCCESS:
    if(action.payload.data){
      return action.payload.data;
    }
    case UNAUTH_USER:
      console.log('unauth');
      return {state, authenticated: false};
  }
  return state;
}

