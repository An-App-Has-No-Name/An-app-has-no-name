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
      clickedAnswer: null,
      hover: false
    }
    this.checkAnswer = this.checkAnswer.bind(this);
  }

  checkAnswer(event) {
    if(this.state.answeredOnce === false){
        this.setState({completed: true});
      if(this.props.question.correct_answer === event.target.getAttribute('data')) {
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
        clickedAnswer: event.target.getAttribute('data'),
      });
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
    const props = this.props.question;
      console.log('props in render qd',this.props)
      if(!props){
        return null
      }
      const question = unescapeHelper(props.question);
      const answerArray = [unescapeHelper(props.correct_answer)]
      for(let i = 0; i < props.incorrect_answers.length; i++){
        answerArray.push(unescapeHelper(props.incorrect_answers[i]))
      }
      let finalAnswer = (
        <div>
          <div>Your answer: </div>
          <div>{this.state.clickedAnswer}</div>
        </div>
      )
      return (
        <div>
          <h3>{question}</h3>
          <div className="question-answer">
            {this.state.answeredOnce ? finalAnswer : this.renderAnswer(answerArray)}
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
