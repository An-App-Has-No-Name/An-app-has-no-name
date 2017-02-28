'use strict';

import { FETCH_QUESTIONS, FETCH_QUESTIONS_RANDOM, FETCH_MULTI_QUESTIONS, RESET_QUESTION } from '../constants/index';

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

    case FETCH_MULTI_QUESTIONS:
      if (action.payload) {
        return action.payload;
      }

    case RESET_QUESTION:
      return null;
    }
    return state;
}
