import React, {Component} from 'react';
import RandamCategories from './random_categories';
import SelectCategories from '../containers/select-category';
import Header from './header';
import Signin from './auth/signin';
import Singup from './auth/signup';
import Socket from '../socket';
import { connect } from 'react-redux';
import { fetchQuestionsRandCat, fetchQuestionsMultiplayer } from '../actions/index';
import Modal from 'react-modal';
import Promise from 'bluebird';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';




const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      modalOpen: false,
    };
    this.getInput = this.getInput.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomGenerator = this.roomGenerator.bind(this);
    this.gameInit = this.gameInit.bind(this);
    this.playerJoined = this.playerJoined.bind(this);
    this.newGameCreated = this.newGameCreated.bind(this);
    this.start = this.start.bind(this);
    this.fetchQuestionsRandCat = this.props.fetchQuestionsRandCat.bind(this);
    this.fetchQuestionsMultiplayer = this.props.fetchQuestionsMultiplayer.bind(this);
    this.receiveMultiplayerQuestions = this.receiveMultiplayerQuestions.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.roomCheck = this.roomCheck.bind(this);
  }

  componentDidMount(){

    // this.setState({socket: Socket})
    Socket.on('newGameCreated', this.newGameCreated);


    Socket.on('roomCheck', this.roomCheck)
    //Listen to playerJoined at Server ==> invoke this.playerJoined
    Socket.on('playerJoined', this.playerJoined);
    Socket.on('receiveMultiplayerQuestions', this.receiveMultiplayerQuestions);
  }

  getInput(e) {
    let roomId = e.target.value;

    this.setState({roomId: e.target.value});
    if (this.state.roomValid) {
      this.setState({roomValid: true});
    }
    Socket.emit('checkRoom', roomId);
  }

  newGameCreated(data) {
    console.log('this is room ', data)
    this.setState({roomCreated: data.roomId});
    // this.setState({players: })

    // At this point , the host joined the room.
    this.fetchQuestionsRandCat(this.state.roomCreated);
  }

  joinRoom(e){

    let data =  {
      roomId: this.state.roomId
    };
    if (this.state.roomValid) {
      //Call JoinRoom at server and send the data Object .
      Socket.emit('JoinRoom', data);
      this.setState({
        roomId: ''
      });
      console.log(this.state.roomValid)
    } else {
      alert('No room')
    }
  }

  fetchQuestionFromServer() {
    // this.fetchQuestionsMultiplayer();
    console.log('TOUCHING JOIN ROOM')
  }

  playerJoined(data) {

    console.log('Player Joining:', data.roomId);
    // browserHistory.push('/multiplayer');
    this.setState({
      modalOpen: true
    });


    // **** At this point ,reset the state to data.roomId.

    // **** At this point, user already joined

    // There will be 1 host and 1 player.

  }


  roomCheck(flag) {

    if (flag.valid) {
      this.setState({roomValid: true});
    } else {
      this.setState({roomValid: false});
      console.log("not valid");
    }
  }

  roomGenerator(e){
    e.preventDefault();

    // this.fetchQuestionsRandCat();
    Socket.emit('CreateRoom');
  }

  start() {
    //Call fetchQuestions at Server and send the data back
    let data = {
      roomId: this.state.roomCreated,
      questions: this.props.questions
    }
    Socket.emit('fetchQuestions', data);
  }

  receiveMultiplayerQuestions(data) {
    console.log("broadcasting", data);
      this.fetchQuestionsMultiplayer(data.questions);
  }

  gameInit(data) {
    this.setState({roomId: data.roomId, mySocketId: data.mySocketId});
  }

  closeModal() {
    this.setState({modalOpen: false});
  }

  render(){

    let html = {
      roomCreated: (<div>
        <h1>YOUR ROOM NUMBER IS:</h1>
          <h2>{this.state.roomCreated}</h2>
      </div>),
      generateButton: (
        <button onClick={this.roomGenerator}>Generate room</button>
      ),

      startGameButton: (
        <Link to="/multiplayer" onClick={this.start}>
          <button >Start Game</button>
        </Link>
      ),

      joinButton : (
        <Link to={this.state.roomValid ? "/multiplayer" : "/"} onClick={this.joinRoom}>
          <button >Join room</button>
        </Link>
      )
    }

    return (
      <div>
        <Header />
        <SelectCategories />
        <RandamCategories />

        <form >
          {this.state.roomCreated ? null : html.generateButton}
          {this.state.roomCreated ? html.roomCreated : null}
        </form>

        <input
          type="text"
          placeholder="Enter a room"
          value={this.state.roomId}
          onChange={this.getInput}
          onKeyUp={this.check}>
        </input>

        {this.state.roomId ? html.joinButton : null}

        <div>
          <Modal
            isOpen={this.state.modalOpen}
            onRequestClose={() => {
                this.closeModal();
              }
            }
            style={customStyles}
          >
          <h1>Player joined! Press Start to Play</h1>
          <button onClick={this.closeModal}>Close</button>
          {this.state.roomCreated ? html.startGameButton : null}
          </Modal>
        </div>

      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    questions: state.QuestionReducer,
  };
}

export default connect(mapStateToProps, {fetchQuestionsRandCat, fetchQuestionsMultiplayer})(Main);
