import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form'
import { connect } from 'react-redux'
import { browserHistory } from 'react-router'
import Multiselect from 'react-widgets/lib/Multiselect';
import 'react-widgets/dist/css/react-widgets.css';
import { fetchQuestions } from '../actions/index';
import { Button, Card, Collapsible, CollapsibleItem, Modal} from 'react-materialize';

const renderMultiselect = ({ input, ...rest }) => {
  if (input['value'].length >= 5) {
    return (
       <div>
          <Multiselect {...input}
            onBlur={() => input.onBlur()}
            value={input.value || []}
          />
        <div>You can only choose 5 categories.</div>
        </div>
    )
  }
  return (
  <div>
    <Multiselect {...input}
      onBlur={() => input.onBlur()}
      value={input.value || []}
      {...rest}
    />
  </div>)
}

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
    const { handleSubmit, pristine, reset, submitting, maxLength } = this.props;
    return (
      <div>
        <form onSubmit={handleSubmit(this.submit)}>
          <div>
            <Field
              className="tooltipped"
              data-position="bottom" data-delay="50"
              data-tooltip="Click me to choose categories"
              name="categories"
              value="Select 5 categories"
              component={renderMultiselect}
              data={categoriesList} />
          </div>
          <div className="select-category-button-group">
            <Button className="select-category-button" type="submit" disabled={pristine || submitting}>Play</Button>
            <Button className="select-category-button" type="Button" disabled={pristine || submitting} onClick={reset}>Reset Values
            </Button>
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
