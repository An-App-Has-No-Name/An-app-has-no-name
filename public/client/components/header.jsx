import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { checkAuth } from '../actions/index';
class Header extends Component {
    constructor(props) {
    super(props);
    this.renderSigninStatus = this.renderSigninStatus.bind(this);
    this.renderLogoutStatus = this.renderLogoutStatus.bind(this);
    }

  renderSigninStatus() {
    if(this.props.username){
      return (
        <div>
        <li>
          <Link to="/users/signout">Signout</Link>
        </li><h5 className="auth-nav">You're signed in as {this.props.username}</h5>
        </div>
      )
    }
  }

  renderLogoutStatus() {
    return (
      <h5 className="auth-nav">to save score!</h5>
    )
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-top">
        <div className="container-fluid">
          <ul className="nav navbar-nav">
            <li >
              <Link className="li-header" to="/">Home</Link>
            </li>
            <li>
              <Link className="li-header" to="/scores/leaderboard">Leaderboard</Link>
            </li>

            <div className="auth-nav"> {this.props.authenticated}
            { this.props.authenticated ?
              <li>
                <li>{this.renderSigninStatus()}</li>
              </li>
                :
              <li>
                {this.renderLogoutStatus()}
                <li>
                  <Link to="/users/signin">Signin</Link>
                </li>
                  <li><h5 className="auth-nav">OR</h5></li>
                <li>
                  <Link to="/users/signup">Create Account</Link>
                </li>
              </li>
            }
            </div>
            {/* <span >{this.forceUpdate()}</span> */}
          </ul>
        </div>
      </nav>
    )
  }
}

function mapStateToProps(state) {
  return {
    loginStatus: state.SigninReducer,
    // signupStatus: state.AuthReducer,
    authenticated: state.AuthReducer.authenticated,
    username: state.AuthReducer.username,
  };
}

export default connect(mapStateToProps, {checkAuth})(Header);
