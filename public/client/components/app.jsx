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
      this.setState({roomId: data.roomId});
    });
  }
  renderScore() {
    if (this.state.roomId) {
      // console.log('Multiplayer', this.state.roomId)
      return (
        <table  className="Score-Table" >
          <td className="Right-Score">
            <Score />
          </td>
          <td className="Left-Score">
            <MultiplayerScore />
          </td>
        </table>
      );
    } else {
      return (
        <div className="Center-Score">
          <Score />
        </div>
      );
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
