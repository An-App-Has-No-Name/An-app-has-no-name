import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { fetchQuestionsRandCat, changeScore } from '../actions/index';

class FetchBar extends Component {

  constructor(props) {
    super(props);
    this.fetchQuestionsRandCat = this.props.fetchQuestionsRandCat.bind(this);
    this.reset = this.reset.bind(this);
    this.changeScore = this.props.changeScore.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit() {
    this.fetchQuestionsRandCat();
    browserHistory.push('/play/questionlist');
  }
  reset() {
    this.fetchQuestionsRandCat();
    this.changeScore(0);
  }
  render() {
    return (
      <div>
        <button onClick={this.submit}>Get Random Categories Instead</button>
        {/* <Link to="/play" onClick={this.fetchQuestionsRandCat} className="btn btn-primary btn-lg btn-block navbar" data-loading-text="Loading...">Get Random Categories Instead</Link> */}
      </div> 
    );
  }
}

export default connect(null, {fetchQuestionsRandCat, changeScore})(FetchBar);
