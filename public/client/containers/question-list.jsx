import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Modal from 'react-modal';
import { browserHistory, withRouter, Link } from 'react-router';
import QuestionDetail from './question-detail';
import { selectQuestion, changeScore, resetQuestion, saveScore } from '../actions/index';
import Socket from '../socket';
import ReactCountDownClock from 'react-countdown-clock';
import ResultDetail from './result-detail';
import * as audio from '../audio';
import {customStyles} from '../helpers/lodashHelper.js';
import path from 'path';
import { Button } from 'react-materialize';

const ReactToastr = require("react-toastr");
const {ToastContainer} = ReactToastr;
const ToastMessageFactory = React.createFactory(ReactToastr.ToastMessage.animation);

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
    this.sendScore = this.sendScore.bind(this);
    this.leaveRoomInMiddle = this.leaveRoomInMiddle.bind(this);
  }

  componentWillUnmount() {
    console.log(this.state.roomId)
    if (this.state.roomId) {
      this.changeScore(0);
      this.leaveRoomInMiddle();
    }
  }

  routerWillLeave(nextLocation) {
    // return false to prevent a transition w/o prompting the user,
    // or return a string to allow the user to decide:
    if (!this.state.gameOver) {
      return 'Your work is not saved! Are you sure you want to leave?';
    }
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


//When a user left
  Socket.on('userleaving', (data) => {
    console.log('LEaving');
    Materialize.toast('The other player left', 4000);
    //Call gameOver with data
    this.setState({gameOver: true});
    this.gameOver(data);
  });
}

// Open Answer Modal
openModal(question) {

  this.setState({answerResultModal: question.correct_answer});

  // Check if question was answered or it is not the correct turn
  if (((this.state.chosenQuestion.includes(question._id) || !this.state.yourTurn) && this.state.roomId) || question.clicked === true) {

    // If it is alert
    this.addAlert('Player 2 picking...');

  } else {

    // Create data variable to send back to server to broadcast
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

      //Single Player mode
      this.setState({modalOpen: true});
    }

    //set it to keep track in Single Player mode
    question.clicked = true;
  }
}

  sendScore() {
    const id = localStorage.getItem('id');
    const score = this.props.playerOneScore;
    const username = localStorage.getItem('username');

    const scoreData = { score, id, username }
    console.log(scoreData, "HERE'S THE SCORE");
    this.props.saveScore(scoreData)
  }

leaveRoomInMiddle() {
  Socket.emit('leaveRoomInMiddle', this.state.roomId);
}
// Broadcasting when in multiplayer mode or just push endgame route
gameOver(data) {
  if(this.state.roomId){

    //Multiplayer
    if(data.gameOver){
      // audio.play('gameOver');
      this.setState({
        gameOver: true
      });
    }
  } else {
    this.reset();
  }
}

// Reset questions to be null
reset(){
  // this.changeScore(0);
  this.resetQuestion();
}

// Get the score
getScore(data){
  this.setState({p1ScoreResultModal: data});
}

// Close the result Modal
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

  // Single Player mode

  if (!this.state.roomId && this.state.singleP.length === 25) {
      this.setState({gameOver: true});
      this.gameOver();
  }
}

// Close the Answer Modal, Not the result
closeModal() {
  let data = {
    roomId: this.state.roomId,
    modalOpen: !this.state.modalOpen,
    chosenQuestion: this.state.chosenQuestion.length,
    currentQuestion: this.state.currentQuestion,
  };

  // Multiplayer
  if (this.state.roomId) {
    Socket.emit('closeModal', data);
  } else {
  // SinglePlayer
    let counter = 0;
    this.setState({
      modalOpen: false,
      singleP: [counter++, ...this.state.singleP]
    });
  }

  //Send the data back to Server to broadcast
  Socket.emit('trackingGame', data);
  this.setState({resultModal:true});
}

// Final modal close
closeEndingModal(){
  this.sendScore();
  Socket.emit('leaveRoomAndEndGame', this.state.roomId);
  this.reset();
  const url = path.resolve(__dirname, '../../', 'index.html')
  browserHistory.push(url);
}

// Questions render
renderQuestion(questions) {
  const { modalOpen } = this.state;
  return questions.map(question => {
    return (
      <div className="list-question"
        onClick={(e) => {
            e.preventDefault()
            this.openModal(question)
            if (!this.state.roomId) {
              this.props.selectQuestion(question);
            }
          }
        }>
        {(this.state.chosenQuestion.includes(question._id) || question.clicked) ? null : question.difficulty}
      </div>
    );
  })
}

// render the categories title with the questions list below
renderList() {
  if(!this.props.questions){
    return (
      <div>Loading...</div>
    )
  }
  let Entertainment = [
    'Entertainment: Books',
    'Entertainment: Film',
    'Entertainment: Music',
    'Entertainment: Television',
    'Entertainment: Video Games',
    'Entertainment: Board Games',
    'Entertainment: Japanese Anime & Manga',
    'Entertainment: Cartoon & Animations'
  ];
  let cutCate;

  // get rid of 'Entertainment'
  return Object.keys(this.props.questions).map(cate => {
    if(Entertainment.includes(cate)){
      cutCate = cate.slice(15);
    } else {
      cutCate = cate;
    }
    return (
       <td id="Table-col">
        <div className="list-header-item">
          {cutCate}
        </div>
         <div key={cate}>
          {this.renderQuestion(this.props.questions[cate])}
         </div>
       </td>
    );
  });
}

renderModal(condition, html) {
  return (
    <Modal
      isOpen={condition}
      onRequestClose={() => {
          this.closeModal() || this.closeResult();
        }
      }
      shouldCloseOnOverlayClick={false}
      style={customStyles}>
      {html}
    </Modal>)
}

// All Modals
renderAllModals() {

  // Render who win or draw
  let showWinner;
  if (this.state.playerTwoScore === this.props.playerOneScore) {
    showWinner = <h3>Draw!</h3>
  } else if (this.state.playerTwoScore > this.props.playerOneScore) {
    showWinner = <h3>Player 2 wins!</h3>
  } else {
    showWinner = <h3>You Win!</h3>
  }

  let loadingView = {
    loading: (
      <div className="loading singleP">
        <h1>Loading the questions, be ready, calm down, sit tight!...</h1>
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
      </div>
    ),
    waitingHost: (
      <div className="waitingHost">
        <h1>Waiting for host, calm down, sit tight... </h1>
        <div className="progress">
          <div className="indeterminate"></div>
        </div>
        <Button onClick={this.closeEndingModal}>Exit</Button>
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
          {/* check if Multiplayer mode or not */}
          {this.state.roomId ?
            <div><h1>Player 2: {this.state.playerTwoScore}</h1>
            {showWinner}</div> : null
          }

          <Button onClick={callback}>Go to home page</Button>
        </div>
        )
      }.bind(this),

    questionDetailView: function(callback) {
      return (
        <div>
          <QuestionDetail  closeModal={this.closeModal} roomId={this.state.roomId} getScore={this.getScore}/>
        </div>
      )
    }.bind(this),

    questionResultView: function(callback) {
      return (
        <div>
          <ResultDetail  roomId={this.state.roomId} Player1={this.state.p1ScoreResultModal} Player2={this.state.p2ScoreResultModal} Correct={this.state.answerResultModal} />
          <ReactCountDownClock
            seconds={3}
            color="#26a69a"
            alpha={1.5}
            showMilliseconds={false}
            size={75}
            onComplete={callback}
          />
          <div className="close-result-button" >
            <Button  onClick={callback}>Close</Button>
          </div>
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

// Toast
addAlert (info) {
  if(this.state.roomId){
    this.refs.container.info(
      info)
  }
}

//react render
render () {
    return (
      <div className="List-group" key={this.props.questions}>
        <div>
          <ToastContainer ref="container"
                          toastMessageFactory={ToastMessageFactory}
                          timeOut={10000}
                          className="toast-top-center" />
        </div>
        <table className="table-question">
          {this.renderList()}
        </table>
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

export default connect(mapStateToProps, {selectQuestion, changeScore, resetQuestion, saveScore})(withRouter(QuestionList));;
