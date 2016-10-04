'user strict';
import {
  FETCH_LEADERBOARD,
} from '../constants/index';


export default function(state = null, action) {
  switch(action.type) {
  case FETCH_LEADERBOARD:
    if (action.payload) {
      console.log(action.payload.data, "What's the data like");
      return action.payload.data;
    } 
  }
  return state;
}


