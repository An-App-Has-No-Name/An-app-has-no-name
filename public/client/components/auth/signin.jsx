import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { browserHistory, Link } from 'react-router';
import { SubmissionError } from 'redux-form';
import * as actions from '../../actions/index';
import Header from '../header';
import { Button, Input, Form, CollapsibleItem, Modal} from 'react-materialize';


const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <div>
    <div>
      <Input {...input} placeholder={label} type={type}/>
      { touched && error && <div className="form-error">{error}</div> }
    </div>
  </div>
)

class Signin extends Component {
  constructor (props) {
    super(props);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
  }

  handleFormSubmit(values) {
    console.log(values, 'values');
    this.props.signinUser(values);
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <Header />
        <div className="table-auth" >
          <div className="auth-header">Sign In</div>
          <form  onSubmit={handleSubmit(this.handleFormSubmit)}>
            <Field id="input-group" name="username" type="text" component={renderField} label="Username"/>
            <Field id="input-group" name="password" type="password" component={renderField} label="Password"/>
            <div className="button-wrapper-parent">
              { this.props.errorMessage && this.props.errorMessage.signin &&
                <div className="error-container signin-error"> { this.props.errorMessage.signin }</div> }
              <div className="button-wrapper">  
                <Button type="submit" disabled={submitting}>Log In</Button>
                <Button type="button" disabled={pristine || submitting} onClick={reset}>Clear Values</Button>
              </div>
              <div className="auth-option">
                <Link to='/users/signup'>Sign Up instead
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const validate = props => {
  const errors = {};
  const fields = {'username': 'Username', 'password': 'Password'};

  Object.keys(fields).forEach((f) => {
    if(!(f in props)) {
      errors[f] = `${fields[f]} is required!`;
    }
  });
  return errors;
}

function mapStateToProps(state){
  return {
    errorMessage: state.AuthReducer.error,
  };
}

const SigninForm = reduxForm({
  validate,
  form: 'signin',
})(Signin);

export default connect(mapStateToProps, actions)(SigninForm);
