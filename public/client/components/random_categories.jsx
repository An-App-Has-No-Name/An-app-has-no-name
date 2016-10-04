import React, { Component } from 'react';
import { connect } from 'react-redux';
import { browserHistory, Link } from 'react-router';
import { fetchQuestionsRandCat, changeScore } from '../actions/index';
import { Button, Card, Collapsible, CollapsibleItem, Modal} from 'react-materialize';


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
     $('#singlePlayerModal').closeModal();
  }
  reset() {
    this.fetchQuestionsRandCat();
    this.changeScore(0);
  }
  render() {
    return (
      <div>
        <Button waves="light" onClick={this.submit}>Get Random Categories Instead</Button>
      </div>
    );
  }
}

export default connect(null, {fetchQuestionsRandCat, changeScore})(FetchBar);
