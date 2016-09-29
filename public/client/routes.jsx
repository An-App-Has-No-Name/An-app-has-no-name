import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import App from './components/app';
import Main from './components/main';
import FinishGame from './components/finish-game';
import Singout from './components/auth/signout';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Main}  />
    <Route path="/users/signout" component={Singout}/>
    <Route path="/play" component={App}  />
    <Route path="/multiplayer" component={App} />
    <Route path="/endgame" component={FinishGame} />
  </Router>
);
