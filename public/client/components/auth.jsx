import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { SubmissionError } from 'redux-form';
import { checkLogin } from '../actions/index';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

class Login extends Component {
  constructor (props) {
    super(props);
    this.checkLogin = this.props.checkLogin.bind(this);
    this.submitAndCheck = this.submitAndCheck.bind(this);
  }

  submitAndCheck(values) {
    this.checkLogin(values);
    console.log(values);
    // browserHistory.push('/play');
  }
  renderLoginStatus() {
    if(!this.props.loginStatus){
      return (
        <div>Sign in to save scores!</div>
      )
    }
    return (
      <div> {this.props.loginStatus.data}</div>
    )
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit(this.submitAndCheck)}>
        <Field name="username" type="text" component={renderField} label="Username"/>
        {/* <Field name="password" type="password" component={renderField} label="Password"/> */}
        {/* {error && <strong>{error}</strong>} */}
        <div>
          <button type="submit" disabled={submitting}>Log In</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
          <div>{this.renderLoginStatus()}</div>
        </div>
      </form>
    )
  }
}

function mapStateToProps(state){
  return {
    loginStatus: state.LoginReducer,
  };
}

const LoginForm = reduxForm({
  form: 'loginForm',
})(Login);

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ checkLogin }, dispatch)
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
