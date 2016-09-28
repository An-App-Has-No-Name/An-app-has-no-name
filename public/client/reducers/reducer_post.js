'use strict';

import { FETCH_QUESTIONS, FETCH_QUESTIONS_RANDOM, FETCH_MULTI_QUESTIONS } from '../constants/index';


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

        console.log(action.payload)
        return action.payload;
      } else {
        console.log('need data')
      }
  }
    return state;
}
