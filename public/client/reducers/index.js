'user strict';

import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import activeQuestion from './reducer_active_question';
import QuestionReducer from './reducer_post';
import ScoreReducer from './reducer_score';

const rootReducer = combineReducers({
  activeQuestion,
  QuestionReducer,
  ScoreReducer,
  form: formReducer,
});

export default rootReducer;
