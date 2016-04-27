const
    React = require('react'),
    jade = require('react-jade'),
    Router = require('react-router'),
    Route = Router.Route,
    Link = Router.Link,
    RouteHandler = Router.RouteHandler,
    frame = jade.compileFile(__dirname + '/../templates/Frame.jade');

const Frame = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  render : frame
});

module.exports = Frame;
