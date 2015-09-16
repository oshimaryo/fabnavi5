var React = require('react');
var ProjectStore = require('../stores/ProjectStore');
var jade = require('react-jade');

var Router = require('react-router'); 
var DefaultRoute = Router.DefaultRoute;
var Link = Router.Link;
var Route = Router.Route;
var RouteHandler = Router.RouteHandler;

var createProject = jade.compileFile(__dirname + '/../templates/CreateProject.jade');
var ProjectActionCreator = require('../actions/ProjectActionCreator');
var CreateProject = React.createClass({


  _onChange : function () {
  },
  getInitialState: function() {
    return {
      name : "",
      description : ""
    };
  },

  getDefaultProps: function() {
     return {
     };
   },

  handleChange : function( e ) {
  },

  handleNameChange : function( e ) {
    this.setState({name : e.target.value});
  },
  handleDescriptionChange : function( e ) {
    this.setState({description : e.target.value});
  },

  handleSubmit : function( e ) {
    ProjectActionCreator.createProject({
      name : this.state.name, 
      contentAttributesType : "Content::PhotoList"
    });  
  },

  render : createProject,

  componentWillMount : function() {
  },

  componentDidMount : function () {
  },

  componentWillUpdate : function() {
    return {
    };
  },

  componentDidUpdate : function() {
    return {
    };
  },

  componentWillUnmount : function() {
  },


});

module.exports = CreateProject;
