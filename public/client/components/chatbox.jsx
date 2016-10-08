import React, {Component} from 'react';
import Socket from '../socket';
import Moment from 'moment';
import { Button, Card, Collapsible, CollapsibleItem, Modal} from 'react-materialize';


export default class Chatbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      username: null,
      canEdit: true
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount(){
    Socket.on('message', data => {
     this.setState({messages: [data, ...this.state.messages]});
    });
  }


  addUser(a){
    a.preventDefault();
    if (this.state.canEdit) {
      this.setState({username: a.target.value});
      Socket.emit('username', this.state.username);

    }
  }
  handleSubmit(e) {
    e.preventDefault();
    const body = e.target.value;

    if (e.keyCode === 13 && body) {

    const data = {
        message: body,
        from: this.state.username,
        time: Moment().format("LT")
      };
    Socket.emit('message', data);
    e.target.value = '';
    this.setState({canEdit: false});
   }
 }

  render(){
    const messages = this.state.messages.map((data, index) => {
      return (
        <li key={index}>{data.from ? data.from : "Guest"}: {data.message} <span className="timestamp">{data.time}</span></li>
      );
    });
    return (


      <div>

        <div className="chat-container">
          <h3 className="chat-room">Trivardy Chatroom</h3>
        </div>
        <div className="message-container">
          <div className="Messages">
            <ul className="chat">{messages}</ul>
          </div>
        </div>
          <div className="user-input">
            <form onSubmit={this.handleSubmit} className="form-inline">
              <div className="form-group">
              <input type="text" className="form-control" id="input-group" placeholder="Enter Username" onKeyUp={this.addUser}/>
                <div>
                  <input type="text" className="form-control" id="input-group" placeholder="Enter Message" onKeyUp={this.handleSubmit}/>
                </div>
              </div>
            </form>
          </div>
      </div>

    );
  }
}
