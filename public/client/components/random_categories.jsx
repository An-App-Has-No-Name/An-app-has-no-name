import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { fetchQuestionsRandCat } from '../actions/index';

class FetchBar extends Component {

  constructor(props) {
    super(props);
    this.fetchQuestionsRandCat = this.props.fetchQuestionsRandCat.bind(this);
  }

  render() {
    return (
      <Link to="/play" onClick={this.fetchQuestionsRandCat} className="btn btn-primary btn-lg btn-block navbar" data-loading-text="Loading...">Get Random Categories Instead</Link>
    );
  }
}

export default connect(null, {fetchQuestionsRandCat})(FetchBar);
