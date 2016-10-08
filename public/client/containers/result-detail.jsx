import React, { Component }  from 'react';
import { unescapeHelper } from '../helpers/lodashHelper';

export default class ReactDetail extends Component {
  constructor (props) {
    super(props);
  }

  renderResult(correctAnswer) {
    if(this.props.roomId){
      return (
        <div>
          <h2>Player1 Score: {this.props.Player1}</h2>
          <h2>Player2 Score:  {this.props.Player2}</h2>
          <h2>Correct Answer: {correctAnswer}</h2>
        </div>
      );

    } else {
      return (
        <div>
          <h2>Player1 Score: {this.props.Player1}</h2>
          <h2>Correct Answer: {correctAnswer}</h2>
        </div>
      );
    }
  }

  render() {
    const correctAnswer = unescapeHelper(this.props.Correct)
    return (
      <div className="result-modal">
        {this.renderResult(correctAnswer)}
      </div>
    );
  }
}
