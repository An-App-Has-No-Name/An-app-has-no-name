import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { changeScore } from '../actions/index';
import Socket from '../socket';

export default class MultiplayerScore extends Component {
  constructor(props){
    super(props);
    this.state = {
      score: 0
    };
  }

componentDidMount(){
  // Socket.on('broadcastScore', (data) => {
  //   console.log("in broadcast score", data)
  //   this.setState({score: data.score}).bind(this);
  // });

  Socket.on('broadcastScore', (data) => {
    console.log("in broadcast score", data)
    this.setState({score: data.score});
  });
}



  render() {
    return (
      <div className="multiplayerScore">
        <div className="panel panel-default">
          <div className="panel-heading">Player 2 Score</div>
          <div className="panel-body">
            {this.state.score}
          </div>
        </div>
      </div>
    );
  }
}
