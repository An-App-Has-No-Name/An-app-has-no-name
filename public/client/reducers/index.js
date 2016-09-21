'user strict';

import { combineReducers } from 'redux';
import questions from './reducer_question';
import activeQuestion from './reducer_active_question';
import QuestionReducer from './reducer_post';
import CategoriesListReducer from './reducer_categoriesList';
// import { reducer as formReducer } from 'redux-form';

const rootReducer = combineReducers({
  questions,
  activeQuestion,
  QuestionReducer,
  categories: CategoriesListReducer
});

export default rootReducer;
