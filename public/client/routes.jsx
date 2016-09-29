import React from 'react';
import { IndexRoute, Route, Router, browserHistory } from 'react-router';
import App from './components/app';
import Main from './components/main';
import FinishGame from './components/finish-game';
import Singout from './components/auth/signout';
import Signup from './components/auth/signup';
import Signin from './components/auth/signin';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Main}  />
    <Route path="/users/signout" component={Singout}/>
    <Route path="/users/signin" component={Signin}/>
    <Route path="/users/signup" component={Signup}/>
    <Route path="/play" component={App}  />
    <Route path="/multiplayer" component={App} />
    <Route path="/endgame" component={FinishGame} />
  </Router>
);
