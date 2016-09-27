import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import QuestionDetail from './question-detail';
import { selectQuestion } from '../actions/index';
import Socket from '../socket';

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

class QuestionList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }


componentWillMount() {
    Socket.on('receiveMultiplayerQuestions', (data) => {
      console.log("roomID in QuestionList", data.roomId);
      this.setState({roomId: data.roomId});
    });
}

componentWillUpdate() {
  Socket.on('receiveOpenOrder', (data) => {
    console.log('broadcasting', data.modalOpen)
    this.setState({
      modalOpen: data.modalOpen,
      question: data.question
    });
    this.props.selectQuestion(data.question);
  });
}

openModal(question) {
  if (question.clicked) {
    console.log("Already cliked", question.question);
  } else {
    // this.setState({modalOpen: true});

    let data = {
      roomId: this.state.roomId,
      modalOpen: true,
      question: question
    };

    // Invoke openModal at the server and send data back
    Socket.emit('openModal', data);
  
    question.clicked = true;
  }
}

closeModal() {
  this.setState({modalOpen: false});
}

renderQuestion(questions) {
  const { modalOpen } = this.state;
  return questions.map(question => {
    return (
      <div className="question-list">
        <div
          key={question._id}
          onClick={() => {
              this.openModal(question)
            }
          }
          disabled={question.clicked}
          className="list-group-item questions"
        >
          {question.difficulty}
        </div>

        <Modal
          isOpen={this.state.modalOpen}
          onAfterOpen={this.afterOpenModal}
          onRequestClose={() => {
              this.closeModal();
            }
          }
          style={customStyles}
        >
          <QuestionDetail  checkCompleted={this.closeModal} />
          <button onClick={this.closeModal}>Close</button>
        </Modal>
      </div>
    );
  })
}

renderList() {
  if(!this.props.questions){
    return (
      <div> Loading...</div>
    )
  }
  return Object.keys(this.props.questions).map(cate => {
    return (
       <td id="customTable">
         <th  className="list-group-item" key={cate} >
           {cate}
         </th>
         {this.renderQuestion(this.props.questions[cate])}
       </td>
    );
  });
}

render (){
    return (
      // <div className="List-group" key={this.props.questions}>
        <table className="table">
          <td>{this.renderList()}</td>
        </table>
      // </div>
    );
  }
}

function mapStateToProps(state){
  return {
    questions: state.QuestionReducer,
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectQuestion: selectQuestion }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
