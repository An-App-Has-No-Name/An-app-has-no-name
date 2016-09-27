import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactCountDownClock from 'react-countdown-clock';
import _ from 'lodash';
import { changeScore, incrementScore, decrementScore } from '../actions/index';
import { unescapeHelper } from '../helpers/lodashHelper';


class QuestionDetail extends Component {
  constructor (props) {
    super(props);
  
    this.checkAnswer = this.checkAnswer.bind(this);
  }


  checkAnswer(event) {
    this.setState({completed: true});
    if(this.props.question.correct_answer === event.target.id) {
      this.props.incrementScore(this.props.score, this.props.question.difficulty);
      // this.props.question.difficulty = "CORRECT";
      alert('Correct');
    } else {
      this.props.decrementScore(this.props.score, this.props.question.difficulty);
      // this.props.question.difficulty = "INCORRECT";
      alert('Wrong');
    }

    this.props.question.difficulty = '';
    this.props.checkCompleted();
  }

  renderAnswer(array) {
    const shuffle = _.shuffle(array);
    return shuffle.map((answer) => {
      return (
        <div id={answer} onClick={this.checkAnswer}>
            {answer}
        </div>
      );
    });
  }

  render() {
    const props = this.props.question;
    if(!props){
      return (
        <div />
      );
    }
    const question = unescapeHelper(props.question);
    const answerArray = [unescapeHelper(props.correct_answer)]
    for(let i = 0; i < props.incorrect_answers.length; i++){
      answerArray.push(unescapeHelper(props.incorrect_answers[i]))
    }

    return (
      <div>
        <h3>Question:</h3>
        <h3>{question}</h3>
          {this.renderAnswer(answerArray)}
          <ReactCountDownClock
            seconds={15}
            color="blue"
            alpha={1.5}
            showMilliseconds={false}
            size={75}
            onComplete={this.props.checkCompleted.bind(this)}
          />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    question: state.activeQuestion,
    score: state.ScoreReducer,
  };
}


function mapDispatchToProps(dispatch) {
  return bindActionCreators({ changeScore, decrementScore, incrementScore }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionDetail)
