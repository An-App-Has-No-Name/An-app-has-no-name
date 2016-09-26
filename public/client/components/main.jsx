import React, {Component} from 'react';
import RandamCategories from './random_categories';
import SelectCategories from '../containers/select-category';

import { connect } from 'react-redux';
import { fetchQuestionsRandCat } from '../actions/index';



import { Link } from 'react-router';


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      room: '',

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
  }

  componentDidMount(){
    this.socket = io();
    this.socket.on('newGameCreated', this.newGameCreated);

    this.socket.on('errors', this.errors);
    this.socket.on('playerJoined', this.playerJoined);
  }

  getInput(e) {
    this.setState({room: e.target.value});
  }

  newGameCreated(data) {
    console.log('this is room ', data)
    this.setState({room: data.gameId});
  }

  joinRoom(e){
    e.preventDefault();

    let data =  {
      gameId: this.state.room
    };

    this.socket.emit('JoinRoom', data);
    this.setState({
      room: ''
    });
  }

  playerJoined(data) {
    console.log('Player Joining:', data.gameId);
  }

  roomGenerator(e){
    e.preventDefault();

    // const user = {
    //   username: e.target.value,
    // };
    this.fetchQuestionsRandCat();
    this.socket.emit('CreateRoom');
  }

  start() {
    if(!this.props.questions){
      console.log('loading')
    }

    // var promise = new Promise(function(resolve, reject) {
    //
    // });

    console.log(this.props.questions)

    this.socket.emit('fetchQuestions', this.props.questions);
  }

  errors(data) {
    alert(data.message);
  }

  gameInit(data) {
    this.setState({gameId: data.gameId, mySocketId: data.mySocketId});
  }

  render(){
    return (
      <div>
        <SelectCategories />
        <RandamCategories />

      <form >
        <input type="text" placeholder="Enter username"></input>
        <button onClick={this.roomGenerator}>Generate room </button>
        <div>Room: {this.state.room}</div>
      </form>

      <form  onSubmit={ this.joinRoom }>
        <input
          type="text"
          placeholder="Enter a room"
          value={this.state.room}
          onChange={this.getInput}>
        </input>
          <button type="submit">Join room</button>
      </form>



      <button onClick={this.start}>Start Game</button>

      </div>


    );
  }
}

function mapStateToProps(state){
  return {
    questions: state.QuestionReducer,
  };
}

export default connect(mapStateToProps, {fetchQuestionsRandCat})(Main);
