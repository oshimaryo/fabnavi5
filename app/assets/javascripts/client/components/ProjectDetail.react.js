var React = require('react');
var ProjectListStore = require('../stores/ProjectListStore');
var jade = require('react-jade');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var projectDetail = jade.compileFile(__dirname + '/../templates/ProjectDetail.jade');
var ProjectDetail = React.createClass({

  contextTypes: {
    router: React.PropTypes.func
  },

  getStateFromStores : function getStateFromStores(){
    return {
    };
  },

  _onChange : function (){
    this.setState(this.getStateFromStores());
  },
  getInitialState: function(){
    return this.getStateFromStores();
  },

  getDefaultProps: function(){
    return {
    };
  },

  render : projectDetail,

  componentWillMount : function(){
  },

  componentDidMount : function (){
    State.reload();
  },

  componentWillUpdate : function(){
    return {
    };
  },

  componentDidUpdate : function(){
    return {
    };
  },

  componentWillUnmount : function(){
  },
});

module.exports = ProjectDetail;
