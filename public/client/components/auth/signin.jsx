import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory } from 'react-router';
import { SubmissionError } from 'redux-form';
import * as actions from '../../actions/index';
import Header from '../header';
import { Button, Input, Form, CollapsibleItem, Modal} from 'react-materialize';


const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <label>{label}</label>
    <div>
      <Input {...input} placeholder={label} type={type}/>
      {touched && error && <span>{error}</span>}
    </div>
  </div>
)

class Signin extends Component {
  constructor (props) {
    super(props);
    // this.props.checkLogin = this.props.props.checkLogin.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values) {
    this.props.checkLogin(values);
    browserHistory.push('/');
  }
  renderLoginStatus() {
    if(!this.props.loginStatus){
      return (
        <h4>Sign in to save scores!</h4>
      )
    }
    return (
      <div>{this.props.loginStatus.data}</div>
    )
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <Header />
        <div className="table-auth" >
          <form  onSubmit={handleSubmit(this.handleFormSubmit)}>
            <Field id="input-group" name="username" type="text" component={renderField} label="Username"/>
            <Field id="input-group" name="password" type="password" component={renderField} label="Password"/>
            <div>
              <Button type="submit" disabled={submitting}>Log In</Button>
              <Button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</Button>
              <div>{this.renderLoginStatus()}</div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const validate = props => {
  const errors = {};
  const fields = ['username', 'password'];

  fields.forEach((f) => {
    if(!(f in props)) {
      errors[f] = `${f} is required`;
    }
  });

  return errors;
}

function mapStateToProps(state){
  return {
    loginStatus: state.SigninReducer,
  };
}

const SigninForm = reduxForm({
  validate,
  form: 'signin',
})(Signin);

export default connect(mapStateToProps, actions)(SigninForm);
