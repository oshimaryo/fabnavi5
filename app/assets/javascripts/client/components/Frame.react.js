import React from 'react';
import { Route, Link, RouteHandler } from 'react-router';
import frame from '../templates/Frame.jade';

const Frame = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  render : frame
});

module.exports = Frame;
