//Createのページview
var React = require('react');
var ProjectListStore = require('../stores/ProjectListStore');
var jade = require('react-jade');

var Router = require('react-router');
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var createProject = jade.compileFile(__dirname + '/../templates/CreateProject.jade');
var ProjectActionCreator = require('../actions/ProjectActionCreator');
var State = require('../utils/FabnaviStateMachine');

var CreateProject = React.createClass({

  _onChange : function(){
  },
  getInitialState: function(){
    return {
      name : "",
      description : "",
    };
  },

  getDefaultProps: function(){
    return {
    };
  },

  handleChange : function( e ){
  },

  handleNameChange : function( e ){
    this.setState({ name : e.target.value });
  },
  handleDescriptionChange : function( e ){
    this.setState({ description : e.target.value });
  },

  handleSubmit : function( e ){
    ProjectActionCreator.createProject({
      name : this.state.name,
      description : this.state.description,
      contentAttributesType : "Content::PhotoList"
    });
  },

  render : createProject,

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

module.exports = CreateProject;
