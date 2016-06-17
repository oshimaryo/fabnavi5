import React from 'react';
import ProjectListStore from '../stores/ProjectListStore';
import { Route, RouteHandler, Link, DefaultRoute } from 'react-router';
import State from '../utils/FabnaviStateMachine';
import editProject from '../templates/EditProject.jade';
/* XXX
const
    React = require('react'),
    EditContent = require('./EditContent.react.js'),
    EditTitle = require('./EditTitle.react.js'),
    ProjectListStore = require('../stores/ProjectListStore'),
    ProjectStore = require('../stores/ProjectStore'),
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    jade = require('react-jade'),
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler,


    State = require('../utils/FabnaviStateMachine'),
    editProject = jade.compileFile(__dirname + '/../templates/EditProject.jade');
    */

const EditProject = React.createClass({

  propTypes : {
  },


  contextTypes: {
    router: React.PropTypes.func
  },

  getStateFromStores : function getStateFromStores(){
    return {
      projects : ProjectListStore.getProjectsAll(),
    };
  },

  _onChange : function (){
    this.setState(this.getStateFromStores());
  },
  getInitialState: function(){
    return  {
          name : "",
          description : "",
        },
        this.getStateFromStores();
  },

  getDefaultProps: function(){
    return {
      project : null,
      id_array : [],
    };
  },

  getImage: function(){
    console.log("getImage ouou");
  let project ={};
  project.content_array=[];
  project.figure=[];
  project.figure_id =[];
  project.project_id = null;

  for(var i in this.state.projects){
    if(this.state.projects[i].id == this.props.params.projectId){
      project.project_id = this.state.projects[i];
      project.content_array = this.state.projects[i].content;
    }
  }

  for(var i in project.content_array){
    project.figure.push(project.content_array[i].figure.file.file.thumb.url);
    project.figure_id.push(project.content_array[i].figure.figure_id);
  }
    return project;
  },

  onclick: function(){
    let a = this.getImage();
    console.log("button onclick: " + this.props.id_array);
    ProjectActionCreator.editContent(a.project_id,this.props.id_array);
  },


  delete_num: function(){
    let num = "DELETE"+String(this.props.id_array.length);
    return num;
  },

  handleNameChange : function( e ){
    this.setState({ name : e.target.value });
  },
  handleDescriptionChange : function( e ){
    this.setState({ description : e.target.value });
  },



  render : editProject,

  componentWillMount : function(){
    this.props.id_array = [];
    ProjectActionCreator.getAllProjects();　
  },

  componentDidMount : function (){
    State.transition("pages"); 
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
