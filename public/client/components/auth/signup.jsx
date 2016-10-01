import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { SubmissionError } from 'redux-form';
import * as actions from '../../actions/index';

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

class Signup extends Component {
  constructor (props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values) {
    this.props.signupUser(values);
    browserHistory.push('/');
  }  
  renderSignupStatus() {
    if(!this.props.signupStatus){
      return (
        <div> Signup here</div>
      )
    }
    return (
      <div>{this.props.signupStatus.data}</div>
    )
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <form onSubmit={handleSubmit(this.handleFormSubmit)}>
        <Field name="username" type="text" component={renderField} label="Username"/>
        <Field name="password" type="password" component={renderField} label="Password"/>
        <Field name="repassword" type="password" component={renderField} label="Repeat Password"/>
        {/* {error && <strong>{error}</strong>} */}
        <div>
          <button type="submit" disabled={submitting}>Signup</button>
          <button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</button>
          <div>{this.renderSignupStatus()}</div>
        </div>
      </form>
    )
  }
}

const validate = props => {
  const errors = {};
  const fields = ['username', 'password', 'repassword'];

  fields.forEach((f) => {
    if(!(f in props)) {
      errors[f] = `${f} is required`;
    }
  });

  if(props.username && props.username.length < 3) {
    errors.username = "minimum of 4 characters";
  }

  if(props.username && props.username.length > 20) {
    errors.username = "maximum of 20 characters";
  }

  if(props.password && props.password.length < 6) {
    errors.password = "minimum 6 characters";
  }

  if(props.password !== props.repassword) {
    errors.repassword = "passwords doesn't match";
  }

  return errors;
};
function mapStateToProps(state){
  return {
    signupStatus: state.AuthReducer,
  };
}

const SignupForm = reduxForm({
  validate,
  form: 'signup',
})(Signup);

export default connect(mapStateToProps, actions)(SignupForm);

