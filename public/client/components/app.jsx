import React, { Component }  from 'react';
import NavBar from './navigation_bar';
import QuestionList from '../containers/question-list';
import QuestionDetail from '../containers/question-detail';
import CategoryList from '../containers/category-list';

export default class App extends Component {
  render(){
    return (
      <div className="wrap">
        <CategoryList />
      </div>
    );
  }
}
