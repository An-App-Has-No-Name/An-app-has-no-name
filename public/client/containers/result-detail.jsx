import React, { Component }  from 'react';

export default class ReactDetail extends Component {
  constructor (props) {
    super(props);
  }

  renderResult() {
    if(this.props.roomId){
      return (
        <div>
          <h2>Player1 Score: {this.props.Player1}</h2>
          <h2>Player2 Score:  {this.props.Player2}</h2>
          <h2>Correct Answer: {this.props.Correct}</h2>
        </div>
      );

    } else {
      return (
        <div>
          <h2>Player1 Score: {this.props.Player1}</h2>
          <h2>Correct Answer: {this.props.Correct}</h2>
        </div>
      );
    }

  }

  render() {
    return (
      <div className="result-modal">
        {this.renderResult()}
      </div>
    );
  }
}
