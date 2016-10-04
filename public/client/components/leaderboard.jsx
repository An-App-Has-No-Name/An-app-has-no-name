import React, { Component }  from 'react';
import { connect } from 'react-redux';
import * as actions from '../actions/index';

class Leaderboard extends Component {

  componentWillMount() {
    this.props.getLeaderboard();
  }

  renderScores() {
    if (!this.props.leaderboard) {
      return (
        <div>
          Leaderboard is loading...
        </div>
      )
    } else {
      return (
        <table className="table-question">
          <tr>
            <th>Position</th>
            <th>Username</th>
            <th>Score</th>
          </tr>
          {this.props.leaderboard.scores.map((score) => {
            return (
              <tr>
                <td>{score.position}</td>
                <td>{score.username}</td>
                <td>{score.scoreVal}</td>
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
