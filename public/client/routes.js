import React from 'react';
//Route define connection bwt url and route
import { Route, IndexRoute } from 'react-router';

import App from './components/app';
// import QuestionsList from './containers/questionsList';
import Categories from './containers/categories';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Categories} />
  </Route>
);
