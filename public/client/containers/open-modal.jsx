var openModal = function(question) {

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

export default openModal;