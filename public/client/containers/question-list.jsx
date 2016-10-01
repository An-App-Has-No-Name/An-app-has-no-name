import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { browserHistory, withRouter, Link } from 'react-router';
import QuestionDetail from './question-detail';
import { selectQuestion, changeScore, resetQuestion } from '../actions/index';
import Socket from '../socket';
import ReactCountDownClock from 'react-countdown-clock';
import ResultDetail from './result-detail';
import * as audio from '../audio';
import {customStyles} from '../helpers/lodashHelper.js';

var ReactToastr = require("react-toastr");
var {ToastContainer} = ReactToastr;
var ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);


class QuestionList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false,
      chosenQuestion: [],
      singleP: [],
      resultModal: false,
      p1ScoreResultModal: "0",
      p2ScoreResultModal: "0",
      answerResultModal: '',
      gameOver: false,
      playerTwoScore: 0,
      yourTurn: false,
    };
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.gameOver = this.gameOver.bind(this);
    this.closeResult = this.closeResult.bind(this);
    this.getScore = this.getScore.bind(this);
    this.closeEndingModal = this.closeEndingModal.bind(this);
    this.changeScore = this.props.changeScore.bind(this);
    this.resetQuestion = this.props.resetQuestion.bind(this);
    this.reset = this.reset.bind(this);
    this.routerWillLeave = this.routerWillLeave.bind(this);
    this.renderModal = this.renderModal.bind(this);
    this.renderAllModals = this.renderAllModals.bind(this);
    this.addAlert = this.addAlert.bind(this);
  }

  routerWillLeave(nextLocation) {
    // return false to prevent a transition w/o prompting the user,
    // or return a string to allow the user to decide:
    if (!this.state.gameOver) {
      this.reset();
      this.changeScore(0);
      return 'Your work is not saved! Are you sure you want to leave?';
    }
      // return false;
  }

  componentWillMount() {
      Socket.on('receiveMultiplayerQuestions', (data) => {
        this.setState({roomId: data.roomId});
      });

      Socket.on('playerJoined', (data) => {
        this.setState({roomId: data.roomId});
      });
  }

componentDidMount() {
  this.props.router.setRouteLeaveHook(this.props.route, this.routerWillLeave)
  Socket.on('receiveOpenOrder', (data) => {
    console.log(data);
    this.setState({
      modalOpen: !data.modalOpen,
      chosenQuestion: [data.question._id, ...this.state.chosenQuestion],
      answerResultModal: data.question.correct_answer,
      currentQuestion: data.question
    });
    this.props.selectQuestion(data.question);
  });

  Socket.on('receiveCloseOrder', (data) => {
    this.setState({
      modalOpen: false,
      resultModal: true,
    });
  });

  Socket.on('broadcastScore', (data) => {
    this.setState({
      p2ScoreResultModal: data.amount,
      playerTwoScore: data.score,
    });
  });

  Socket.on('gameOver', this.gameOver);
  Socket.on('turnChange', (data) => {
    //broadcast yourTurn to be true to the other player
    this.setState({yourTurn: data.yourTurn});
  });
}

openModal(question) {
  this.setState({answerResultModal: question.correct_answer});
  if (((this.state.chosenQuestion.includes(question._id) || !this.state.yourTurn) && this.state.roomId) || question.clicked === true) {
    console.log('Not available');
    this.addAlert('Player 2 picking...')
  } else {
    let data = {
      roomId: this.state.roomId,
      modalOpen: this.state.modalOpen,
      question: question,
      chosenQuestion: this.state.chosenQuestion.length
    };
    // Invoke openModal at the server and send data back
    //Check if multiplayer or not
    if (this.state.roomId) {
      Socket.emit('openModal', data);
      // Set turn to be false
      this.setState({yourTurn: false});

    } else {
      this.setState({modalOpen: true});
    }
    question.clicked = true;

  }
}

gameOver(data) {
  console.log("CHECKING ROOM ID", this.state.roomId);
  if(this.state.roomId){

    //Multiplayer
    if(data.gameOver){
      audio.play('gameOver');
      this.setState({
        gameOver: true
      });
      // browserHistory.push('/endgame');
    }
  } else {

    //
    this.reset();
    browserHistory.push('/endgame');

    // browserHistory.push(url);
  }
}
reset(){
  this.changeScore(0);
  this.resetQuestion();
}

getScore(data){
  this.setState({p1ScoreResultModal: data});
}

closeResult(){
  this.setState({
    resultModal:false,
    modalOpen: false,
    p1ScoreResultModal: "0",
    p2ScoreResultModal: "0"
  });
  if (!this.state.gameOver) {
    this.state.yourTurn ? this.addAlert('My Turn') : this.addAlert('Player 2 picking...');
  }
}
closeModal() {
  let data = {
    roomId: this.state.roomId,
    modalOpen: !this.state.modalOpen,
    chosenQuestion: this.state.chosenQuestion.length,
    currentQuestion: this.state.currentQuestion,
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
    if(this.state.singleP.length === 2){
      this.setState({
        gameOver: true
      });
      this.gameOver();
    }
  }
  Socket.emit('trackingGame', data);
  this.setState({resultModal:true});
}

closeEndingModal(){
  this.reset();
  const url = path.resolve(__dirname, '../../', 'index.html')
  browserHistory.push(url);
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
          onClick={(e) => {
              e.preventDefault()
              this.openModal(question)
              if (!this.state.roomId) {
                this.props.selectQuestion(question);
              }
            }
          }
          className="list-group-item questions"
        >
          {(this.state.chosenQuestion.includes(question._id) || question.clicked) ? null : question.difficulty}
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

renderModal(condition, html) {
  return (<Modal
    isOpen={condition}
    onRequestClose={() => {
        this.closeModal() || this.closeResult();
      }
    }
    shouldCloseOnOverlayClick={false}
    style={customStyles}
  >
  {html}
  </Modal>)
}

renderAllModals() {

  let loadingView = {
    loading: (
      <h1>Loading... </h1>
    ),
    waitingHost: (
      <div>
        <h1>Waiting for host.. </h1>
        <button onClick={this.closeModal}>Exit</button>
      </div>
    ),

    playerPicking: {
      player1: "Your turn pick a question",
      player2: "Player2 picking"
    },

    endingView: function(callback){
      return (
        <div>
          <h1>Your score: {this.props.playerOneScore}</h1>
          <h1>Player 2: {this.state.playerTwoScore}</h1>
          {this.state.playerTwoScore > this.props.playerOneScore ? <h3>Player 2 wins!</h3> : <h3>You Win!</h3>}
          <button onClick={callback}>Go to home page</button>
        </div>
        )
      }.bind(this),

    questionDetailView: function(callback) {
      return (
        <div>
          <QuestionDetail  closeModal={this.closeModal} roomId={this.state.roomId} getScore={this.getScore}/>
          <button onClick={callback}>Close</button>
        </div>
      )
    }.bind(this),

    questionResultView: function(callback) {
      return (
        <div>
          <ResultDetail  roomId={this.state.roomId} Player1={this.state.p1ScoreResultModal} Player2={this.state.p2ScoreResultModal} Correct={this.state.answerResultModal} />
          <ReactCountDownClock
            seconds={5}
            color="blue"
            alpha={1.5}
            showMilliseconds={false}
            size={75}
            onComplete={callback}
          />
        <button onClick={callback}>Close</button>
        </div>
      )
    }.bind(this)
  };

  let allModal = {
    waitingModal: this.renderModal(
      this.props.questions ? false : true,
      this.state.roomId ? loadingView.waitingHost : loadingView.loading
    ),
    endingModal: this.renderModal(
      this.state.gameOver,
      loadingView.endingView(this.closeEndingModal)
    ),
    questionDetailModal: this.renderModal(
      this.state.modalOpen,
      loadingView.questionDetailView(this.closeModal)
    ),
    questionResultModal: this.renderModal(
      this.state.resultModal,
      loadingView.questionResultView(this.closeResult)
    )
  }
  return {allModal, loadingView}
}

addAlert (info) {
  console.log(ToastMessageFactory.info)
  if(this.state.roomId){
    this.refs.container.info(
      info)
  }
}

render () {
    return (
      <div className="List-group" key={this.props.questions}>
        <div>
          <ToastContainer ref="container"
                          toastMessageFactory={ToastMessageFactory}
                          timeOut={10000}
                          className="toast-top-center" />
        </div>
        <table className="table">
          <td>{this.renderList()}</td>
        </table>
        {this.state.roomId ? (this.state.yourTurn ? this.renderAllModals().loadingView.playerPicking.player1 : this.renderAllModals().loadingView.playerPicking.player2) : null}
        {this.renderAllModals().allModal.waitingModal}
        {this.renderAllModals().allModal.endingModal}
        {this.renderAllModals().allModal.questionDetailModal}
        {this.renderAllModals().allModal.questionResultModal}
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    questions: state.QuestionReducer,
    roomId: state.roomId,
    playerOneScore: state.ScoreReducer
  };
}

export default connect(mapStateToProps, {selectQuestion, changeScore, resetQuestion})(withRouter(QuestionList));;
