'user strict';
import {
  USER_INFO,
  OPPONENT_INFO
} from '../constants/index';
import Socket from '../socket';

export default function(state = {}, action) {
  switch(action.type) {

    case USER_INFO:
    if (action.payload) {
      Socket.emit('fetchUserInfo', action.payload)
      return { ...state, userInfo: action.payload };
      // return {userInfo: action.payload}
    }
    case OPPONENT_INFO:
    if (action.payload) {
      // console.log("Userinfo to send to chatroom", action.payload);
      // Socket.emit('fetchOpponentInfo', action.payload)
      return { ...state, opponentInfo: action.payload };
    }
  }
    return state;
}