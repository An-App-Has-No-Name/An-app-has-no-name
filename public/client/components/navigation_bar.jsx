import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { fetchQuestion } from '../actions/index';
import { Link } from 'react-router';

class FetchBar extends Component {

  constructor(props) {
    super(props);

    this.fetchQuestion = this.props.fetchQuestion.bind(this);
  }

  render() {
    return (
      <Link to="/play" onClick={ this.fetchQuestion } className="btn btn-primary btn-lg btn-block navbar" data-loading-text="Loading...">Play</Link>
    );
  }
}


export default connect(null, {fetchQuestion})(FetchBar);
