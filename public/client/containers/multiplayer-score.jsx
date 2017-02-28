import React, { Component }  from 'react';
import { connect } from 'react-redux';
import { changeScore, opponentInfo } from '../actions/index';
import Socket from '../socket';

class MultiplayerScore extends Component {
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

  Socket.on('gotUserInfo', (data) => {
    // console.log("in gotUserInfo score", data)
    if (data.username) {
      this.setState({player2name:data.username})
      this.props.opponentInfo(data.username, data.roomId)
    }
  });
  Socket.on('broadcastScore', (data) => {
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

// function mapStateToProps(state){
//   return {

//   };
// }

export default connect( null, { opponentInfo })(MultiplayerScore)
