import React, { Component }  from 'react';
import QuestionList from '../containers/question-list';
import Score from '../containers/score';
import MultiplayerScore from '../containers/multiplayer-score';
import Socket from '../socket';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import {  saveUserInfo } from '../actions/index';

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomId: null,
      username: localStorage.getItem('username'),
      yourTurn: false,
      opponentTurn: true
    };
  }

  componentWillMount() {
    //Get the room id
    Socket.on('receiveMultiplayerQuestions', (data) => {
      this.setState({roomId: data.roomId});
      if (this.state.username) {
        this.props.saveUserInfo(this.state.username, data.roomId)
      } else {
        this.setState({username: 'Opponent'})
        this.props.saveUserInfo(this.state.username, data.roomId)
      }
    });
    // console.log('Username from joinRoom: ', this.state.username);
  }

  componentDidMount() {
    Socket.on('turnChange', (data) => {
      //broadcast yourTurn to be true to the other player
      console.log('THis is your turn', data)
      this.setState({yourTurn: data.yourTurn});
    });

    Socket.on('myTurn', (bool) => {
      this.setState({yourTurn: bool});
    });
  }


  renderScore() {
    console.log('this.props.userInfo', this.props.userInfo);
    if (this.state.roomId) {
      let turnStyle;
      let opponentStyle;

      if (this.state.yourTurn) {
        turnStyle = {backgroundColor: '#2fd0c0'};
        opponentStyle = {backgroundColor: '#d5f6f2'};
        console.log('This is your Turn:', this.state.yourTurn);
      } else {
        turnStyle = {backgroundColor: '#d5f6f2'};
        opponentStyle = {backgroundColor: '#2fd0c0'}
        console.log('This is your Turn:', this.state.yourTurn);
      }
      // console.log('Multiplayer', this.state.roomId)

      return (
        <table  className="Score-Table" >
          <td className="Right-Score">
            <Score turnStyle={turnStyle}/>
          </td>
          <td className="Left-Score">
            <MultiplayerScore turnStyle={opponentStyle}/>
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

function mapStateToProps(state){
  return {
    userInfo: state.UserInfoReducer,
  };
}


export default connect(mapStateToProps, { saveUserInfo})(App);
