'user strict';
import {
  USER_INFO
} from '../constants/index';
import Socket from '../socket';

export default function(state = null, action) {
  switch(action.type) {

    case USER_INFO:
    if (action.payload) {
      // console.log("Userinfo to send to chatroom", action.payload);
      Socket.emit('fetchUserInfo', action.payload)
      return {userInfo: action.payload}
    }
  }
    return state;
}