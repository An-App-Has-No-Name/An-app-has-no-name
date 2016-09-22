'user strict';

import { combineReducers } from 'redux';
import activeQuestion from './reducer_active_question';
import QuestionReducer from './reducer_post';


const rootReducer = combineReducers({
  activeQuestion,
  QuestionReducer,
});

export default rootReducer;
