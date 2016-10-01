'use strict';

import { INCREMENT_SCORE, CHANGE_SCORE, DECREMENT_SCORE } from '../constants/index';
import Socket from '../socket';

export default function(state = null, action) {
  switch(action.type) {
    case CHANGE_SCORE:
    if(action.score || action.score === 0){

      return action.score;
    }


    case INCREMENT_SCORE:
      let plus = '+' + action.difficulty;
      let incScore = action.score + action.difficulty;
      let dataInc = {
        score: incScore,
        roomId: action.roomId,
        amount: plus,
      };
      console.log("dataInc", dataInc);
      Socket.emit('changingScore', dataInc);

      return dataInc.score;


    case DECREMENT_SCORE:
      let minus = '-' + action.difficulty;
      let decScore = action.score - action.difficulty;
      let dataDec = {
        score: decScore,
        roomId: action.roomId,
        amount: minus
      };
      console.log("dataDec", dataDec);
      Socket.emit('changingScore', dataDec);

      return dataDec.score;
  }
  return state;
}
