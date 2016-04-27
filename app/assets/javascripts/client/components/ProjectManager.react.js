const
    React = require('react'),

    Navigation = require('./Navigation.react'),
    SearchBar = require('./SearchBar.react'),
    ProjectList = require('./ProjectList.react'),
    Player = require('./Player.react.js'),
    Frame = require('./Frame.react.js'),
    Footer = require('./Footer.react.js'),
    jade = require('react-jade'),

    Router = require('react-router'),
    Link = Router.Link,
    RouteHandler = Router.RouteHandler,
    State = require('../utils/FabnaviStateMachine'),
    projectManager = jade.compileFile(__dirname + '/../templates/ProjectManager.jade');

const ProjectManager = React.createClass({
  render: projectManager,
  componentDidMount : function(){

  },

  componentWillUpdate : function(){
  },

  componentDidUpdate : function(){
  },

  componentWillUnmount : function(){
  },

});

module.exports = ProjectManager;
