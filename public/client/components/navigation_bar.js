import React, { Component } from 'react';
import { Link } from 'react-router'

export default class SearchBar extends Component {

  render() {
    return (
      <Link to="/categories" className="btn btn-primary">Fetch</Link>
    );
  }
}
