import React, {Component} from 'react';
import Socket from '../socket';


export default class Chatbox extends Component {
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      username: null
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  componentDidMount(){
    Socket.on('message', message => {
     this.setState({messages: [message, ...this.state.messages]});
    });
  }


  addUser(a){
    a.preventDefault();
    this.setState({username: a.target.value});
  }
  handleSubmit(e) {
    e.preventDefault();
    const body = e.target.value;

    if (e.keyCode === 13 && body) {
      const message = {
        body,
      };

     this.setState({messages: [message, ...this.state.messages]});
     Socket.emit('message', body);
     e.target.value = '';
   }
 }

  render(){
    const messages = this.state.messages.map((message, index) => {
      console.log(message.body)
      return <li key={index}>{this.state.username}: {message.body}</li>
    });
    return (
      <div>
        <div className="message-container">
          <ul className="chat">{messages}</ul>
        </div>
        <form onSubmit={this.handleSubmit} className="form-inline">
          <div className="form-group">
            <div className="input-group">
              <input type="text" className="form-control" placeholder="Enter Username" onKeyUp={this.addUser}/>
              <input type="text" className="form-control" placeholder="Enter Message" onKeyUp={this.handleSubmit}/>
            </div>
          </div>
        </form>
      </div>
    );
  }
}
