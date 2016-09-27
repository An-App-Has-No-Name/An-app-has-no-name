import React, { Component }  from 'react';
import QuestionList from '../containers/question-list';
import Score from '../containers/score';

export default class App extends Component {

  constructor(props) {
    super(props);
    this.state = {messages: []};
  }




  addUser() {
    const user = {
      username: socket.id
    }
  }

  handleSubmit(e) {
    const body = e.target.value;

    if (e.keyCode === 13 && body) {
      const message = {
        body,
        room: this.state.room
      }
      this.setState({messages: [message, ...this.state.messages]});


      this.socket.emit('message': body);
      console.log('body',this.socket)
      e.target.value = '';
    }
  }

  render(){

    const messages = this.state.messages.map((message, index) => {
     return <div key={index}><b>{message.from}:</b>{message.body} </div>
    });

    return (
      <div className="wrap">
        <QuestionList/>
        <Score />
        <div> {this.state.room} </div>
        <div> {messages} </div>
        <input type="text" onKeyUp={this.handleSubmit.bind(this)}></input>
      </div>
    );
  }
}
