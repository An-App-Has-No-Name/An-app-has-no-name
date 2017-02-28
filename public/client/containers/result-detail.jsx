import React, { Component }  from 'react';
import he from 'he';

export default class ReactDetail extends Component {
  constructor (props) {
    super(props);
  }

  renderResult() {
    if(this.props.roomId){
      return (
        <div>
          <h2>Your Score: {this.props.Player1}</h2>
          <h2>{this.props.playerTwoName}'s Score:  {this.props.Player2}</h2>
          <h2>Correct Answer: {correctAnswer}</h2>
        </div>
      );

    } else {
      return (
        <div>
          <h2>Your Score: {this.props.Player1}</h2>
          <h2>Correct Answer: {correctAnswer}</h2>
        </div>
      );
    }
  }

  render() {
    const correctAnswer = he.decode(this.props.Correct)
    return (
      <div className="result-modal">
        {this.renderResult()}
      </div>
    );
  }
}
