import React, {Component} from 'react';
import RandomCategories from './random_categories';
import SelectCategories from '../containers/select-category';
import Multiplayer from './multiplayer';
import Header from './header';
import Signin from './auth/signin';
import Singup from './auth/signup';
import Socket from '../socket';
import { connect } from 'react-redux';
import { fetchQuestionsRandCat, fetchQuestionsMultiplayer, resetQuestion, changeScore } from '../actions/index';
import Modals from 'react-modal';
import Promise from 'bluebird';
import {browserHistory} from 'react-router';
import { Link } from 'react-router';
import _ from 'lodash';
import {customStyles} from '../helpers/lodashHelper.js';
import Chatbox from './chatbox';
import { Button, Card, Collapsible, CollapsibleItem, Modal} from 'react-materialize';


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomId: '',
      modalOpen: false,
      roomList: [],
      host: {
        room: null,
        id: null
      }
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
    this.validateRoom = this.validateRoom.bind(this);
    this.newRoomCreated = this.newRoomCreated.bind(this);
    this.resetQuestion = this.props.resetQuestion.bind(this);
    this.changeScore = this.props.changeScore.bind(this);
  }


  componentDidMount(){

    // this.setState({socket: Socket})
    Socket.on('newGameCreated', this.newGameCreated);
    Socket.on('validateRoom', this.validateRoom)
    //Listen to playerJoined at Server ==> invoke this.playerJoined
    Socket.on('playerJoined', this.playerJoined);
    Socket.on('receiveMultiplayerQuestions', this.receiveMultiplayerQuestions);
    Socket.on('newRoomCreated', this.newRoomCreated);
    this.resetQuestion();
    this.changeScore(0);

  }


  getInput(e) {
    let roomId = e.target.value;
    this.setState({roomId: e.target.value});
    if (this.state.roomValid) {
      this.setState({roomValid: true});
    }
    _.debounce(Socket.emit('checkRoom', roomId), 500);
  }

  newGameCreated(data) {

    this.setState({roomCreated: data.room});
    this.setState({
      host: {
        room: data.room.toString(),
        id: data.mySocketId,
      }
    });
    // At this point , the host joined the room.
    this.fetchQuestionsRandCat(this.state.roomCreated);
  }

  newRoomCreated(data) {
    this.setState({
      roomList: [data.roomList, ...this.state.roomList],
    });
  }

  joinRoom(e){

    let data =  {
      roomId: this.state.roomId,
    };

    if (this.state.roomValid) {
      //Call JoinRoom at server and send the data Object .
        $('#multiplayerModal').closeModal();

        Socket.emit('JoinRoom', data);
        this.setState({
          roomId: ''
        });
          console.log(this.state.roomValid);

    } else {
      this.setState({
        roomId: ''
      });
      Materialize.toast('This room is not available', 4000);
      // alert('This room not available');
    }
  }

  playerJoined(data) {

    // console.log('Player Joining:', data);

    this.setState({
      modalOpen: true,
      roomList: data.roomList
    });

    $('#multiplayerModal').closeModal();
    Materialize.toast('New Player Joined', 4000);
  //At this point ,reset the state to data.roomId.

    // **** At this point, user already joined

    // There will be 1 host and 1 player.

  }


  validateRoom(flag) {
    if (flag.valid) {
      this.setState({roomValid: true});
      // console.log("valid", this.state.roomValid);

    } else {
      this.setState({roomValid: false});
      // console.log("not valid");
    }
  }

  roomGenerator(e){
    e.preventDefault();

    // this.fetchQuestionsRandCat();
    let host = 1;
    Socket.emit('CreateRoom', host);
  }

  start() {
    //Call fetchQuestions at Server and send the data back
    let data = {
      roomId: this.state.roomCreated,
      questions: this.props.questions,
    };
    Socket.emit('fetchQuestions', data);
    Socket.emit('gameStart', data.roomId);
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

      startGameButton: (
        <Link to="/multiplayer" onClick={this.start}>
          <Button waves='light'>Start Game</Button>
        </Link>
      ),
      singlePayer: (
        <Button waves="light">Single Player</Button>
      ),

      multiplayer: (
        <Button waves="light">Multiplayer</Button>
      ),
      joinButton : (
        <Link to={this.state.roomValid ? "/multiplayer" : "/"} onClick={this.joinRoom}>
          <button>Join room</button>
        </Link>
      )
    }

    return (
      <div className="page-wrap">
        <Header />
        <h1 className='title'>Trivardy</h1>
        <Modal
          id="singlePlayerModal"
          header='Single Player mode'
          bottomSheet
          trigger={
            <Button waves='light'>Single Player</Button>
          }>

          <Collapsible className="container main" popout accordion>
            <CollapsibleItem header='Select 5 Categories to Play'>
              <SelectCategories />
            </CollapsibleItem>
          </Collapsible>

          <RandomCategories />
        </Modal>

        <Modal
          className="room-input"
          id="multiplayerModal"
          header='Create or Join a room'
          bottomSheet
          trigger={
            <Button waves='light'>Multiplayer</Button>
          }>
          <Multiplayer
            roomCreated={this.state.roomCreated}
            roomId={this.state.roomId} host={this.state.host}
            roomGenerator={this.roomGenerator}
            roomValid={this.state.roomValid}
            joinRoom={this.joinRoom}
            getInput={this.getInput}/>
        </Modal>

        <div>
          <Modals
            isOpen={this.state.modalOpen}
            onRequestClose={() => {
                this.closeModal();
              }
            }
            style={customStyles}
            shouldCloseOnOverlayClick={false}>
            <h2>Player joined! Press Start to Play</h2>
            {this.state.roomCreated ? html.startGameButton : null}
          </Modals>
        </div>
        <Chatbox />
        <Link to="/about"><h5>About us</h5></Link>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    questions: state.QuestionReducer,
  };
}

export default connect(mapStateToProps, {fetchQuestionsRandCat, fetchQuestionsMultiplayer, changeScore, resetQuestion})(Main);
