'user strict';

import { combineReducers } from 'redux';
import QuestionsReducer from './reducer_questions';
import ActiveQuestion from './reducer_active_question';
import CategoriesListReducer from './reducer_categoriesList';

const rootReducer = combineReducers({
  questions: QuestionsReducer,
  activeQuestion: ActiveQuestion,
  categories: CategoriesListReducer
});
export default rootReducer;
