import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import { fetchQuestions } from '../actions/index';

const renderMultiselect = ({ input, ...rest }) =>
  <Multiselect {...input}
    onBlur={() => input.onBlur()}
    value={input.value || []}
    {...rest}
  />

const categoriesList =  [
  'General Knowledge',
  'Entertainment: Books',
  'Entertainment: Film',
  'Entertainment: Music',
  'Entertainment: Television',
  'Entertainment: Video Games',
  'Entertainment: Board Games',
  'Entertainment: Japanese Anime & Manga',
  'Entertainment: Cartoon & Animations',
  'Science & Nature',
  'Science: Computers',
  'Science: Mathematics',
  'Mythology',
  'Sports',
  'Geography',
  'History',
  'Politics',
  'Art',
  'Celebrities',
  'Animals',
  'Vehicles',
];

class SelectCategories extends Component {

  constructor (props) {
    super(props);
    this.fetchQuestions = this.props.fetchQuestions.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(values) {
    this.fetchQuestions(values.categories);
    browserHistory.push('/play/questionlist');
  }

  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <div>
            <label>Select Categories</label>
            <Field
              name="categories"
              component={renderMultiselect}
              data={categoriesList}
            />
          </div>
          <div>
            <button type="submit" disabled={pristine || submitting}>Play</button>
            <button type="button" disabled={pristine || submitting} onClick={reset}>Reset Values
            </button>
          </div>
        </form>
      </div>
    )
  }
}

const SelectCatForm = reduxForm({
  form: 'selectCatForm',
})(SelectCategories);

export default connect(null, {fetchQuestions})(SelectCatForm);
