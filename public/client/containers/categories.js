'user strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router'


class Categories extends Component {

  renderQuestion(questions) {

    return questions.map(question => {
      return (
        <li key={question.question} className="list-group-item">{question.question}</li>
      )
    })
  }

  renderList() {

    return this.props.categories.map(cate => {
      let questions = this.props.questions.filter(question => {
        return question.category === cate
      })

      console.log("filter", questions);
      return (
        <div className="col-md-3">
          <li key={cate} >{cate}</li>
          {this.renderQuestion(questions)}
        </div>

      );
    });
  }

  render() {
    return (
      <div>
          <ul >
              {this.renderList()}
          </ul>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    categories: state.categories,
    questions: state.questions
  };
}

export default connect(mapStateToProps)(Categories);
