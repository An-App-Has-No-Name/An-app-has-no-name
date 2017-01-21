// Close the Answer Modal, Not the result
const closeModal = function() {
  let data = {
    roomId: this.state.roomId,
    modalOpen: !this.state.modalOpen,
    chosenQuestion: this.state.chosenQuestion.length,
    currentQuestion: this.state.currentQuestion,
  };
  // Multiplayer
  if (this.state.roomId) {
    Socket.emit('closeModal', data);
    Socket.emit('trackingGame', data);
  } else {
  // SinglePlayer
    let counter = 0;
    this.setState({
      modalOpen: false,
      singleP: [counter++, ...this.state.singleP]
    });
  }
  //Send the data back to Server to broadcast
  this.setState({resultModal:true});
}


export default closeModal;