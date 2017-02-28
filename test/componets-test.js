import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';
import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import TestUtils from 'react-addons-test-utils';

import FetchBar from '../public/client/components/random_categories';

const middlewares = [thunk];
const mockStore = configureStore(middlewares);


describe('<FetchBar/>', function() {
  const initialState = {
    messages: [],
    username: null,
    canEdit: true
  };
  const store = mockStore(initialState);
  const wrapper = mount(<Provider store={store}><FetchBar onClick={this.submit}/></Provider>);

  it('category test'  , function() {
    expect(wrapper.find('div').hasClass('test')).to.equal(true);
  });

});
// describe('<Header />', () => {
//   const initialState = {}
//   const store = mockStore(initialState)
//   const props = {
//    loginStatus:null,
//    dispatch: () => {},
//    authenticated: null,
//    username: null,
//  }
//  const wrapper = mount(<Provider store={store}><Header /></Provider>);
//
//   it('allows us to set props', () => {
//     expect(
//       wrapper.find('div')
//     )
//   });
//
//   after(function() {
//     global.window.close();
//   });
// });
