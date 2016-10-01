import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactCountDownClock from 'react-countdown-clock';
import _ from 'lodash';
import { changeScore, incrementScore, decrementScore } from '../actions/index';
import { unescapeHelper } from '../helpers/lodashHelper';
import Socket from '../socket';
import FinishGame from '../components/finish-game';
import * as audio from '../audio';

class QuestionDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      answeredOnce: false,
      question: null,
      clickedAnswer: false,
      hover: false
    }
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  checkAnswer(event) {
    if(this.state.answeredOnce === false){
        this.setState({completed: true});
      if(this.props.question.correct_answer === event.target.id) {
        this.props.incrementScore(this.props.score, this.props.question.difficulty, this.props.roomId);
        let adding = '+' + this.props.question.difficulty;
        this.props.getScore(adding);
        this.setState({isModal:true});
        audio.play('correct');
      } else {
        this.props.decrementScore(this.props.score, this.props.question.difficulty, this.props.roomId);
        let subing = '-' + this.props.question.difficulty;
        this.props.getScore(subing);
        this.setState({isModal:true});
        audio.play('wrong');
      }
      this.setState({
        isModal:true,
        answeredOnce: true,
        roomId: this.props.roomId,
        clickedAnswer: event.target.id
      });
    }
    this.setState({
      isModal:true,
      roomId: this.props.roomId
    });
  }

  renderAnswer(array) {
    var linkStyle;
    if (this.state.hover) {
      linkStyle = {backgroundColor: 'blue'}
    }
    const shuffle = _.shuffle(array);
    return shuffle.map((answer) => {
      return (
        <div id={answer} onClick={this.checkAnswer} style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
            {answer}
        </div>
      );
    });
  }

  toggleHover(){
    this.setState({hover: !this.state.hover})
  }

  render() {
    const props = this.props.question;
    if(!this.state.answeredOnce){
      console.log('props in render qd',this.props)
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
              seconds={5}
              color="blue"
              alpha={1.5}
              showMilliseconds={false}
              size={75}
              onComplete={this.props.closeModal}
            />
        </div>
      );
    }
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
