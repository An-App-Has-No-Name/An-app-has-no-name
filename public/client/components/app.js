import React, { Component }  from 'react';
// import Categories from '../containers/categories';
// import QuestionsList from '../containers/questionsList';
import NavBar from './navigation_bar';


export default class App extends Component {
  render(){
    return (
      <div>
        This is App
        <NavBar />
        {this.props.children}
      </div>
    );
  }
}
