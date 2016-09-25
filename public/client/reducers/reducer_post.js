'use strict';

import { FETCH_QUESTIONS, FETCH_QUESTIONS_RANDOM } from '../actions/index';

export default function(state = null, action) {
  switch(action.type) {
    case FETCH_QUESTIONS:
    if(action.payload.data){
      return action.payload.data;
    }
    case FETCH_QUESTIONS_RANDOM:
    if(action.payload.data){
      return action.payload.data;
    }
  }
    return state;
}
