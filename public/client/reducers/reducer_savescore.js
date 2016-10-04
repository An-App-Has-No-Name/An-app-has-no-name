SCORE_SAVE_SUCCESS
'use strict';

import {SCORE_SAVE_SUCCESS
 } from '../constants/index';
// import Socket from '../socket';

export default function(state = null, action) {
  switch(action.type) {
    case SCORE_SAVE_SUCCESS:
    if(action.payload){
      return action.payload;
    }
  }
  return state;
}
