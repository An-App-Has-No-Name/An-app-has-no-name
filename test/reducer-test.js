import React from 'react';
import { expect } from 'chai';
import { shallow, mount, render } from 'enzyme';
import sinon from 'sinon';


import reducer from '../public/client/reducers/reducer_active_category';
import ActionTypes from '../public/client/constants/index'

describe('reducer', () => {
  it('initializes the state', () => {
    expect(reducer(undefined, {})).to.equal(null)
  });
})
