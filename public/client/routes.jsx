import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import App from './components/app';
import Correct from './components/correct';
import Incorrect from './components/incorrect';
import Main from './components/main';


export default (
  <Router history={browserHistory}>
    <Route path="/" component={Main}  />
    <Route path="/play" component={App}  />
    <Route path="/play/multiplayer/12345"component={App} />
    <Route path="/correct" component={Correct} />
    <Route path="/incorrect" component={Incorrect} />
  </Router>
);
