import React from 'react';
import { browserHistory, IndexRoute, Redirect, Route, Router} from 'react-router';
import App from './components/app';
import Main, { leaveRoom } from './components/main';
import Singout from './components/auth/signout';
import Signup from './components/auth/signup';
import Signin from './components/auth/signin';
import QuestionList from './containers/question-list';
import Leaderboard from './components/leaderboard';
import About from './components/about-us';

export default (
  <Router history={browserHistory}>
    <Route path="/" component={Main} />
    <Route path="/users/signout" component={Singout}/>
    <Route path="/users/signin" component={Signin}/>
    <Route path="/users/signup" component={Signup}/>
    <Route path="/scores/leaderboard" component={Leaderboard}/>
    <Route path="/play" component={App}>
        <Route path="/play/questionlist" component={QuestionList}>
            <Route path="/multiplayer" component={App} />
        </Route>
    </Route>
    <Route path="/about" component={About} />
    <Redirect from="*" to="/" /> {/*Redirect changes the url from home.com/dslffdsf to home.com*/}
    <Route path="*" component={Main} /> {/* Will only redirect to home but path stays home.com/dslffdsf */}
  </Router>
);
