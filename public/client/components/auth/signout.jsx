import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/index';
import Header from '../header';

class Signout extends Component {
  componentWillMount() {
    this.props.signoutUser();
  }

  render() {
    return (
      <div className="content">
        <Header />
        <h1> We hope to see you again soon...</h1>
      </div>
    )
  }
}

export default connect(null, actions)(Signout);
