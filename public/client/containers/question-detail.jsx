import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ReactCountDownClock from 'react-countdown-clock';
import _ from 'lodash';
import { changeScore, incrementScore, decrementScore } from '../actions/index';
import { unescapeHelper } from '../helpers/lodashHelper';
import Socket from '../socket';
import * as audio from '../audio';

class QuestionDetail extends Component {
  constructor (props) {
    super(props);
    this.state = {
      answeredOnce: false,
      question: null,
    }
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  checkAnswer(event) {
    if(this.state.answeredOnce === false){

      if (this.props.question.dailyDouble) {
        this.props.question.difficulty = this.props.question.dailyDouble;
      }
        this.setState({answeredOnce: true});
      if(this.props.question.correct_answer === event.target.getAttribute('data')) {

        this.props.incrementScore(this.props.score, this.props.question.difficulty, this.props.roomId);
        let adding = '+' + this.props.question.difficulty;
        this.props.getScore(adding);
        audio.play('correct');
      } else {
        this.props.decrementScore(this.props.score, this.props.question.difficulty, this.props.roomId);
        let subing = '-' + this.props.question.difficulty;
        this.props.getScore(subing);
        audio.play('wrong');
      }
      this.setState({roomId: this.props.roomId});
    }
    if(!this.props.roomId) {
      this.props.closeModal();
    }
  }

  renderAnswer(array) {
    const shuffle = _.shuffle(array);
    return shuffle.map((answer) => {
      return (
        <div id={answer} onClick={this.checkAnswer} >
          <ColorfulLink data={answer} answerClicked={this.state.clickedAnswer} >
            {answer}
          </ColorfulLink>
        </div>
      );
    });
  }

  render() {
    let dailyTripleStyle = {
      color: 'red',
      animation: 'blinker 3s linear infinite'
    }
    if(!this.state.answeredOnce){
      const props = this.props.question;
      if(!props){
        return null
      }
      const question = unescapeHelper(props.question);
      const answerArray = [unescapeHelper(props.correct_answer)]
      for(let i = 0; i < props.incorrect_answers.length; i++){
        answerArray.push(unescapeHelper(props.incorrect_answers[i]))
      }

      return (
        <div>
          <h3>{question}</h3>
          {props.dailyDouble ? <h2 style={dailyTripleStyle}> Trivardy Triple </h2> : null }
          {props.dailyDouble ? audio.play('daily') : null}
          <div className="question-answer">
            {this.renderAnswer(answerArray)}
          </div>
          <ReactCountDownClock
            seconds={12}
            color="#26a69a"
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

var ColorfulLink = React.createClass({
  getInitialState: function(){
    return {
      hover: false,
      active: false
    }
  },
  toggleHover: function(){
    if(!this.state.active ){
      this.setState({hover: !this.state.hover})
    } else {
      console.log("Already answer");
    }
  },
  toggleActive: function(){
    this.setState({
      active: !this.state.active,
      hover: null
    });
  },
	render: function() {
    var id = _.uniqueId("ColorfulLink");
    var activeStyle;
    if(this.state.active){
      activeStyle = {backgroundColor: '#26a69a'}
    } else {
      activeStyle = {backgroundColor: '#eee'}
    }
    var linkStyle;
    if (this.state.hover) {
      linkStyle = {backgroundColor: '#26a69a'}
    } else {
      linkStyle = {backgroundColor: '#eee'}
    }
		return <div id={id} data={this.props.data} onClick={this.toggleActive} style={linkStyle} onMouseEnter={this.toggleHover} onMouseLeave={this.toggleHover}>
			{this.props.children}
		</div>
	}
})
