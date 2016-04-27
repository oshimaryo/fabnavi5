const
    React = require('react'),
    ProjectListStore = require('../stores/ProjectListStore'),
    jade = require('react-jade'),
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler,

    State = require('../utils/FabnaviStateMachine'),
    editProject = jade.compileFile(__dirname + '/../templates/EditProject.jade');

const EditProject = React.createClass({

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

  render : editProject,

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
  }
});

module.exports = EditProject;
