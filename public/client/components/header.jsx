import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

class Header extends Component {
  constructor(props) {
    super(props);
    // this.renderStatus = this.renderStatus.bind(this);
  }
  forceUpdate() {
    return this.renderStatus();
  }
  renderStatus() {
    if(this.props.loginStatus){
      return (
        <div>{this.props.loginStatus.data}</div>
      )
    }
    if(this.props.signupStatus){
      return (
        <div>{this.props.signupStatus.data}</div>
      )
    }
    return <div>Signin or Signup to save score!</div>
  }

  // shouldComponentUpdate() {
  //   this.renderStatus();
  // }

  render() {
    return (
      <div>
        <span>
          <Link to="/users/signup">  Sign up    |</Link>
        </span>
        <span>
          <Link to="/users/signin">  Sign in    |</Link>
        </span>
        <span>
          <Link to="/users/signout">  Signout  </Link>
        </span>
        <span>{this.forceUpdate()}</span>
      </div>
    )
  }
}

function mapStateToProps(state) {
  return { 
    loginStatus: state.SigninReducer,
    signupStatus: state.AuthReducer,
  };
}

export default connect(mapStateToProps)(Header);