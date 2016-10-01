import React, { Component }  from 'react';
import QuestionList from '../containers/question-list';
import Score from '../containers/score';
import MultiplayerScore from '../containers/multiplayer-score';
import Socket from '../socket';
import { withRouter } from 'react-router';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomId: null
    };
  }

  componentWillMount() {
    Socket.on('receiveMultiplayerQuestions', (data) => {
      console.log("roomID in QuestionList", data.roomId);
      this.setState({roomId: data.roomId});
    });
  }

  renderScore() {
    if (this.state.roomId) {
      return (
        <div>
          <Score />
          <MultiplayerScore />
        </div>
      );
    } else {
      return (<Score />);
    }
  }

  render(){
    return (
      <div className="wrap">
        {this.props.children}
        {this.renderScore()}
      </div>
    );
  }
}
