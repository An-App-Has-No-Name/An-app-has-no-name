'use strict';
import { FETCH_CATEGORIES } from '../actions/index';

export default function(state = [], action) {

  switch (action.type) {
    case FETCH_CATEGORIES:
      return [action.payload, ...state];
  }

  return state;
}
