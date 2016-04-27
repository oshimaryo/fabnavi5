var React = require('react');
var jade = require('react-jade');
var Router = require('react-router');
var Route = Router.Route;
var Link = Router.Link;
var RouteHandler = Router.RouteHandler;
var frame = jade.compileFile(__dirname + '/../templates/Frame.jade');
var Frame = React.createClass({
  contextTypes: {
    router: React.PropTypes.func
  },
  render : frame
});

module.exports = Frame;
