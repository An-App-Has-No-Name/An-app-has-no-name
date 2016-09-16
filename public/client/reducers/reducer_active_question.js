'user strict';

export default function(state = null, action) {
  switch(action.type) {
    case 'PERSON_SELECTED': return action.payload;
  }
  return state
}
