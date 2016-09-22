import React, { Component } from 'react';
import QuestionList from './question-list';


export default class CategoryList extends Component {
  render (){
    return (
      <div className="List-group" key={this.props.title}>
        <table id="table">
          <td>
            <QuestionList />
          </td>
        </table>
      </div>
    )
  }
}
