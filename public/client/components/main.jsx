import React, {Component} from 'react';
import RandamCategories from './random_categories';
import SelectCategories from '../containers/select-category';
import Login from './auth';

import { connect } from 'react-redux';
import { fetchQuestionsRandCat, fetchQuestionsMultiplayer } from '../actions/index';

import { Link } from 'react-router';



class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      roomId: '',

    };
    this.getInput = this.getInput.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomGenerator = this.roomGenerator.bind(this);
    this.gameInit = this.gameInit.bind(this);
    this.errors = this.errors.bind(this);
    this.playerJoined = this.playerJoined.bind(this);
    this.newGameCreated = this.newGameCreated.bind(this);
    this.start = this.start.bind(this);
    this.fetchQuestionsRandCat = this.props.fetchQuestionsRandCat.bind(this);
    this.fetchQuestionsMultiplayer = this.props.fetchQuestionsMultiplayer.bind(this);
    this.receiveMultiplayerQuestions = this.receiveMultiplayerQuestions.bind(this);
  }

  componentDidMount(){
    this.socket = io();
    this.socket.on('newGameCreated', this.newGameCreated);


    this.socket.on('errors', this.errors);

    //Listen to playerJoined at Server ==> invoke this.playerJoined
    this.socket.on('playerJoined', this.playerJoined);
    this.socket.on('receiveMultiplayerQuestions', this.receiveMultiplayerQuestions);


  }

  componentWillUpdate() {
  }

  getInput(e) {
    this.setState({roomId: e.target.value});
  }

  newGameCreated(data) {
    console.log('this is room ', data)
    this.setState({roomId: data.roomId});


    // At this point , the host joined the room.
  }

  joinRoom(e){

    let data =  {
      roomId: this.state.roomId
    };

    //Call JoinRoom at server and send the data Object .
    this.socket.emit('JoinRoom', data);
    this.setState({
      roomId: ''
    });
  }

  fetchQuestionFromServer() {
    // this.fetchQuestionsMultiplayer();
    console.log('TOUCHING JOIN ROOM')
  }

  playerJoined(data) {

    console.log('Player Joining:', data.roomId);

    // **** At this point ,reset the state to data.roomId.

    // **** At this point, user already joined

    // There will be 1 host and 1 player.


  }

  roomGenerator(e){
    e.preventDefault();


    this.fetchQuestionsRandCat();
    this.socket.emit('CreateRoom');


  }

  start() {

    if(!this.props.questions){
      console.log('loading')
    }


    // console.log(this.props.questions)

    // this.socket.on('receiveMultiplayerQuestions', (questions) => {
    //   console.log("broadcasting", questions);
    // });
    console.log("aosidjfosjdiogjsdojg aopdjgoj dpogvja odsjodsjoajdsoijaodsj oajsdof ajoi joisd jfoasjdof")

    const data = {
      roomId: this.state.roomId,
      questions: this.props.questions
    };

    //Call fetchQuestions at Server and send the data back
    this.socket.emit('fetchQuestions', data);
  }



  errors(data) {
    alert(data.message);
  }

  receiveMultiplayerQuestions(questions) {
    console.log("broadcasting", questions);
      this.fetchQuestionsMultiplayer(questions);
    // this.setState({questions: questions});
  }

  gameInit(data) {
    this.setState({roomId: data.roomId, mySocketId: data.mySocketId});
  }

  render(){
    return (
      <div>
        <Login />
        <SelectCategories />
        <RandamCategories />

      <form >
        <input type="text" placeholder="Enter username"></input>
        <button onClick={this.roomGenerator}>Generate room </button>
        <div>Room: {this.state.roomId}</div>
      </form>



        <input
          type="text"
          placeholder="Enter a room"
          value={this.state.roomId}
          onChange={this.getInput}>
        </input>

        <Link to="/multiplayer" onClick={this.joinRoom}>
          <button>Join room</button>
        </Link>


      <Link to="/multiplayer" onClick={this.start}>
        <button >Start Game</button>
      </Link>
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
