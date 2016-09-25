import React, {Component} from 'react';
import RandamCategories from './random_categories';
import SelectCategories from '../containers/select-category';
import { Link } from 'react-router';


class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      room: '',

    }
    this.getInput = this.getInput.bind(this);
    this.joinRoom = this.joinRoom.bind(this);
    this.roomGenerator = this.roomGenerator.bind(this);
    this.addUser = this.addUser.bind(this);
  }
  componentDidMount(){
    this.socket = io();
  }
  addUser(e) {
    const user = {
      username: e.target.value,
    };
    console.log('user', user)
  }
  getInput(e) {
    this.setState({room: e.target.value});
  }

  joinRoom(e){
    console.log(e,'event in joinroom')
      e.preventDefault();

      this.socket.emit('JoinRoom', this.state.room);
      console.log('room value', this.state.rooms);

  }

  roomGenerator(){
    this.socket.emit('CreateRoom');
    console.log('createdroom',);

    this.socket.on('newGameCreated', body =>{
      console.log('newGameCreated', body);
      this.setState({room: body.gameId});
    })
  }

  render(){
    return (
      <div>
        <SelectCategories />
        <RandamCategories />
        <input type="text" placeholder="Enter username" onKeyUp={this.addUser}></input>
        <Link onClick={this.roomGenerator} to={`/multiplayer/${this.state.room}`}>
        <button >Generate room </button>
        </Link>
        <div>Room: {this.state.room}</div>

          <input type="text" onSubmit={this.joinRoom} placeholder="Enter a room" value={this.state.room} onChange={this.getInput}></input>
          <Link to={`/multiplayer/${this.state.room}`}>
          <button type="submit" onClick={this.joinRoom} >Join room </button>
          </Link>

      </div>
    );
  }
}

export default Main;
