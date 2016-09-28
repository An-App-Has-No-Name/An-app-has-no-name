'user strict';
import { LOGIN_USER_REQUEST } from '../constants/index';
export default function(state = null, action) {
  switch(action.type) {
    case LOGIN_USER_REQUEST:
    console.log(LOGIN_USER_REQUEST);
    if(action.payload.data){
      console.log(action.payload.data, 'Login check returned from server');
      return action.payload.data;
    }
  }
  return state;
}

