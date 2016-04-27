//Createのページview
const
    React = require('react'),
    ProjectListStore = require('../stores/ProjectListStore'),
    jade = require('react-jade'),

    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler,

    createProject = jade.compileFile(__dirname + '/../templates/CreateProject.jade'),
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    State = require('../utils/FabnaviStateMachine');

const CreateProject = React.createClass({

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
