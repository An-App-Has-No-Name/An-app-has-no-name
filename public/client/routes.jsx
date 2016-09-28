import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import App from './components/app';
import Main from './components/main';


export default (
  <Router history={browserHistory}>
    <Route path="/" component={Main}  />
    <Route path="/play" component={App}  />
    <Route path="/multiplayer" component={App} />
  </Router>
);
