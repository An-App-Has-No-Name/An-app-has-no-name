// 'user strict';
//
// import React, { Component } from 'react';
// import { connect } from 'react-redux';
// import { selectCategory } from '../actions/index';
// import { bindActionCreators } from 'redux';
// 
// class QuestionsList extends Component {
//
//   constructor(props) {
//     super(props);
//
//
//   }
//
//   renderList() {
//     return this.props.questions.map(question => {
//       return (
//         <div>
//
//         </div>
//       )
//     })
//   }
//
//   render (){
//     console.log("This is in quesionList", this.props.questions)
//     return (
//       <ul className="list-group- col-sm-4">
//         {this.renderList()}
//       </ul>
//     );
//   }
// }
//
// function mapStateToProps(state){
//   return {
//     questions: state.questions
//   };
// }
//
// export default connect(mapStateToProps)(QuestionsList);
