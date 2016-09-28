import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { changeScore } from '../actions/index';
import Socket from "../socket";

class Score extends Component {


  componentWillMount() {
    if (!this.props.score) {
      this.props.changeScore(0);
    } else {
      this.props.changeScore(this.props.score);
      console.log("dddddd", this.props.score);
    }
  }


  render() {

    console.log("what is data", this.props.score);
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
