import React, { Component }  from 'react';
import QuestionList from '../containers/question-list';
import Score from '../containers/score';
import MultiplayerScore from '../containers/multiplayer-score';
import Socket from '../socket';
import { changeScore } from '../actions/index';
import { connect } from 'react-redux';
import * as audio from '../audio';

class FinishGame extends Component {
  renderFinal(){

    if(this.props.score < 0){
      return (
        <div>You owe Thang, Spencer, Andrew and Mrinalini ${Math.abs(this.props.score)}</div>
      )
    } else {
      return (<div>Makersquare owes you ${this.props.score}</div>)
    }

  }

  render(){
    audio.play('gameOver');
    return (
      <div>
        <h1>Game Over</h1>
        <h3>Your score: {this.props.score} </h3>
        <div>{this.renderFinal()}</div>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    score: state.ScoreReducer
  }
}
export default connect(mapStateToProps)(FinishGame);
