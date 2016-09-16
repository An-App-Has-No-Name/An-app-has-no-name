'use strict';

export const FETCH_CATEGORIES = 'FETCH_CATEGORIES';

export function selectCategory(questions) {

  return {
    type: FETCH_CATEGORIES,
    payload: questions
  };
}
