import React, { Component }  from 'react';
import NavBar from './navigation_bar';
import QuestionList from '../containers/question-list';
import QuestionDetail from '../containers/question-detail';
import CategoryList from '../containers/category-list';

export default class App extends Component {

  constructor(props) {
    super(props);

    this.state = {messages: []};
  }

  componentDidMount() {

    this.socket = io();



    this.socket.on('message', message => {
      this.setState({messages: [message, ...this.state.messages]});
      console.log("i am socket", message)

    });
  }

  handleSubmit(e) {
    const body = e.target.value;

    if (e.keyCode === 13 && body) {
      const message = {
        body,
        from: 'Thang'
      }
      this.setState({messages: [message, ...this.state.messages]});


      this.socket.emit('message', body);
      console.log('body',this.socket)
      e.target.value = '';
    }


  }

  render(){

    const messages = this.state.messages.map((message, index) => {
     return <li key={index}><b>{message.from}:</b>{message.body} </li>
    });


    return (
      <div className="wrap">
        <CategoryList />
          <ul> {messages} </ul>
          <input type="text" onKeyUp={this.handleSubmit.bind(this)}></input>
      </div>
    );
  }
}
