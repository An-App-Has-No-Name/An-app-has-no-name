import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectQuestion } from '../actions/index';
import { bindActionCreators } from 'redux';
import QuestionDetail from './question-detail';
import Modal from 'react-modal';

const customStyles = {
  content : {
    top                   : '50%',
    left                  : '50%',
    right                 : 'auto',
    bottom                : 'auto',
    marginRight           : '-50%',
    transform             : 'translate(-50%, -50%)'
  }
};

class QuestionList extends Component {

  constructor (props) {
    super(props);
    this.state = {
      modalOpen: false,
    };
    this.checkCompleted = this.checkCompleted.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

checkCompleted() {
  this.setState({modalOpen: false});
  clearTimeout();
}

openModal() {
  let that = this;
  this.setState({modalOpen: true});
  setTimeout(function(){
    that.setState({modalOpen: false});
  }, 10000);
}

closeModal() {
  this.setState({modalOpen: false});
}
// afterOpenModal() {
//   // references are now sync'd and can be accessed.
//   this.refs.subtitle.style.color = '#f00';
// }

renderQuestion(questions) {
  const { modalOpen } = this.state;
  return questions.map(question => {
    return (
      <div onClick={this.openModal} key={this.props.question}>
      <div
        key={this.props.title}
        onClick={() => this.props.selectQuestion(question)}
        className="list-group-item">
        {question.difficulty}
      </div>
      <Modal
        isOpen={this.state.modalOpen}
        onAfterOpen={this.afterOpenModal}
        onRequestClose={this.closeModal}
        style={customStyles} >
        <QuestionDetail  checkCompleted={this.checkCompleted} {...this.state}/>
        <button onClick={this.closeModal}>close</button>
      </Modal>
      </div>
    );
  })
}


renderList() {

  if(!this.props.questions){
    return (
      <div> Loading...</div>
    )
  }
  return Object.keys(this.props.questions).map(cate => {
    return (
       <td id="customTable">
         <th  className="list-group-item" key={cate} >
           {cate}
         </th>
         {this.renderQuestion(this.props.questions[cate])}
       </td>
    );
  });
}


  render (){
    return (
      <div className="List-group" key={this.props.questions}>
        <table id="table">
          <td>{this.renderList()}</td>
        </table>
      </div>
    );
  }
}

function mapStateToProps(state){
  return {
    categories: state.categories,
    questions: state.QuestionReducer,
    modal: state.openModal
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators({ selectQuestion: selectQuestion }, dispatch)
}

export default connect(mapStateToProps, mapDispatchToProps)(QuestionList);
