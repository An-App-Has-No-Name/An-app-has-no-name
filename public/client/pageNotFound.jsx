import React from 'react';
import { Link } from 'react-router';

class PageNotFound extends {
  render() {
    return (
      <div>
        <h1>Page Not Found.</h1>
        <p>Go to <Link to="/">Home Page</Link></p>
      </div>
    )
  }
}
