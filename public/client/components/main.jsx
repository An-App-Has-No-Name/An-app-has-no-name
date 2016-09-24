import React, {Component} from 'react';
import CreateRoom from './navigation_bar';
import RandamCategories from './random_categories';
import SelectCategories from '../containers/select-category';

class Main extends Component {

  constructor(props) {
    super(props);
    this.state = {
      room: [],
    }
    this.roomGenerator = this.roomGenerator.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  addUser(e) {
    const user = {
      username: e.target.value
    };
  }
  roomGenerator(){
    // let roomRandom = ( Math.random() * 10000 ) | 0;
    // this.setState({room: roomRandom });
    //
    this.socket = io();
    // console.log(roomRandom);
    // this.socket.emit('room', roomRandom);

    this.socket.emit('CreateRoom');
    console.log('createdroom',)
    // , room => {
    //   this.setState({room: [room, ...this.state.room]});
    //   console.log('this rooommm', room)
    // })
    this.socket.on('newGameCreated', body =>{
      console.log('newGameCreated', body)
      this.setState({room: [body.gameId, ...this.state.room]});
    })
  }

  render(){
    return (
      <div>
        <SelectCategories />
        <RandamCategories />
        <input type="text" placeholder="Enter username" onKeyUp={this.addUser}></input>
        <button onClick={this.roomGenerator}>Join room </button>
        <div>{this.state.room}</div>
      </div>
    );
  }
}

export default Main;
