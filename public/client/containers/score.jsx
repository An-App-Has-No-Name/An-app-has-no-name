import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { changeScore } from '../actions/index';

class Score extends Component {

  componentWillMount() {
    if (!this.props.score) {
      this.props.changeScore(0);
    } else {
      this.props.changeScore(this.props.score);
    }
  }

  render() {
    return (
      <div>
        <div className="panel panel-default">
          <div className="panel-heading">Your Score</div>
          <div className="panel-body">
            {this.props.score}
          </div>
        </div>
      </div>
    );
  }
}


function mapStateToProps(state){
  return {
    score: state.ScoreReducer,
  };
}

export default connect(mapStateToProps, {changeScore})(Score);
