import React, { Component }  from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';
import Header from './header';
import Moment from 'moment';

class Leaderboard extends Component {

  componentWillMount() {
    this.props.getLeaderboard();
  }

  renderScores() {
    if (!this.props.leaderboard) {
      return (
        <div className="chat-room">
          Leaderboard is loading...
        </div>
      )
    } else {
      return (
        <table className="table-leaderboard">
          <tr className="header-leaderboard">
            <th>Rank</th>
            <th>Username</th>
            <th>Score</th>
            <th className="timeHeader">Time</th>
          </tr>
          {this.props.leaderboard.scores.map((score) => {
            return (
              <tr className="score-leaderboard">
                <td>{score.position}</td>
                <td>{score.username}</td>
                <td>{score.scoreVal}</td>
                <td><span className="time">{Moment(score.time).format('ll')}</span></td>
              </tr>
            )
          })}
        </table>
      )
    }
  }
  render(){
    return (
      <div>
        <Header />
        <div>
          <h1>Leaderboard</h1>
        </div>
        {this.renderScores()}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    leaderboard: state.Leaderboard
  }
}

export default connect(mapStateToProps, actions)(Leaderboard);
