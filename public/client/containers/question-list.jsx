import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { browserHistory } from 'react-router';
import QuestionDetail from './question-detail';
import { selectQuestion, changeScore, resetQuestion } from '../actions/index';
import Socket from '../socket';
import * as audio from '../audio';


const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)',
  }
};

class QuestionList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false,
      chosenQuestion: [],
      singleP: [],
      gameOver: false,
      playerTwoScore: 0
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.closeEndingModal = this.closeEndingModal.bind(this);
    this.changeScore = this.props.changeScore.bind(this);
    this.resetQuestion = this.props.resetQuestion.bind(this);
    this.reset = this.reset.bind(this);
  }


  componentWillMount() {
      Socket.on('receiveMultiplayerQuestions', (data) => {
        console.log("roomID in QuestionList", data.roomId);
        this.setState({roomId: data.roomId});
      });

      Socket.on('playerJoined', (data) => {
        console.log("roomID in QuestionList", data.roomId);
        this.setState({roomId: data.roomId});
      });
  }

componentDidMount() {
  Socket.on('receiveOpenOrder', (data) => {
    this.setState({
      modalOpen: !data.modalOpen,
      chosenQuestion: [data.question._id, ...this.state.chosenQuestion]
    });

    console.log('questionId', data.question._id)
    this.props.selectQuestion(data.question);
  });

  Socket.on('receiveCloseOrder', (data) => {
    this.setState({
      modalOpen: data.modalOpen
    });
  });
  Socket.on('gameOver', this.gameOver);

  Socket.on('broadcastScore', (data) => {

    console.log("in question listen to score", data)
    this.setState({playerTwoScore: data.score});
  });
}

openModal(question) {
  console.log('List of chosenQuestion:', this.state.chosenQuestion)


  if (this.state.chosenQuestion.includes(question._id) || question.clicked === true) {
    console.log("Already cliked", question.question);
  } else {

    let data = {
      roomId: this.state.roomId,
      modalOpen: this.state.modalOpen,
      question: question,
      chosenQuestion: this.state.chosenQuestion.length
    };

    // Invoke openModal at the server and send data back
    if (this.state.roomId) {
      Socket.emit('openModal', data);
    } else {
      this.setState({modalOpen: true});
    }
    question.clicked = true;
  }
}


gameOver(data) {

  if(this.state.roomId){
    if(data.gameOver){
      audio.play('gameOver');
      this.setState({
        gameOver: true
      });
      // browserHistory.push('/endgame');
    }
  } else {
    this.reset();
    browserHistory.push('/endgame');
  }
}
reset(){
  this.changeScore(0);
  this.resetQuestion()
}

closeModal() {

  let data = {
    roomId: this.state.roomId,
    modalOpen: !this.state.modalOpen,
    chosenQuestion: this.state.chosenQuestion.length
  };

  if (this.state.roomId) {

    Socket.emit('closeModal', data);
  } else {
    let counter = 0;
    this.setState({
      modalOpen: false,
      singleP: [counter++, ...this.state.singleP]
    });
    console.log('singleP', this.state.singleP);
    if(this.state.singleP.length === 5){
      this.gameOver();
    }
  }

  Socket.emit('trackingGame', data);
}

closeEndingModal(){
  this.reset();
  browserHistory.push('/');
  this.setState({
    gameOver: false,
  });
}

renderQuestion(questions) {
  const { modalOpen } = this.state;
  return questions.map(question => {
    return (
      <div className="question-list" key={question._id}>
        <div

          onClick={() => {
              this.openModal(question)
              if (!this.state.roomId) {
                this.props.selectQuestion(question);
              }
            }
          }
          disabled={question.clicked}
          className="list-group-item questions"
        >
          {question.difficulty}
        </div>
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
  console.log("roomId", this.state.roomId)
  let loadingView = {
    loading: (
      <h1>Loading... </h1>
    ),
    waitingHost: (
      <div>
        <h1>Waiting for host.. </h1>
        <button onClick={this.closeModal}>Exit</button>
      </div>
    )
  };

  let waitingModal = (
      <Modal
        isOpen={this.props.questions ? false : true}
        onRequestClose={() => {
            this.closeModal();
          }
        }
        style={customStyles}
      >
      {this.state.roomId ? loadingView.waitingHost : loadingView.loading}

      </Modal>
  );
  let endingModal = (
    <Modal
      isOpen={this.state.gameOver}
      onRequestClose={() => {
          this.closeModal();
        }
      }
      style={customStyles}
    >
    <h1>Your score: {this.props.playerOneScore}</h1>
    <h1>Player 2: {this.state.playerTwoScore}</h1>
    {this.state.playerTwoScore > this.props.playerOneScore ? <h3>Player 2 wins!</h3> : <h3>You Win!</h3>}
    <button onClick={this.closeEndingModal}>Go to home page</button>
    </Modal>
  );
    return (
      <div className="List-group" key={this.props.questions}>
        <table className="table">
          <td>{this.renderList()}</td>
        </table>
        {waitingModal}
        {endingModal}
        <Modal
          isOpen={this.state.modalOpen}
          onRequestClose={() => this.closeModal()}
          style={customStyles} >
          <QuestionDetail  closeModal={this.closeModal} roomId={this.state.roomId}/>
          <button onClick={this.closeModal}>Close</button>
        </Modal>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    questions: state.QuestionReducer,
    playerOneScore: state.ScoreReducer
  };
}



export default connect(mapStateToProps, {selectQuestion, changeScore, resetQuestion})(QuestionList);
