import React from 'react';
import ProjectListStore from '../stores/ProjectListStore';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import { Route, RouteHandler, Link, DefaultRoute } from 'react-router';
import State from'../utils/FabnaviStateMachine';
import editProject from '../templates/EditProject.jade';
import EditContent from './EditContent.react.js';
import EditTitle from './EditTitle.react.js';

class EditProject extends React.Component {

  constructor(props){
    super(props);
    this.props = {
      project : null,
      id_array : []
    };
    this.state = this.getStateFromStores();

    this._onChange = this._onChange.bind(this);
  }

  getStateFromStores(){
    return {
      projects : ProjectListStore.getProjectsAll(),
    };
  }

  _onChange(){
    this.setState(this.getStateFromStores());
  }

  getImage(){
    let project = {};
    project.content_array = [];
    project.figure = [];
    project.figure_id = [];
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
  }

  onclick(){
    let a = this.getImage();
    console.log("button onclick: " + this.props.id_array);
    ProjectActionCreator.editContent(a.project_id, this.props.id_array);
  }


  delete_num(){
    let num = "DELETE" + String(this.props.id_array.length);
    return num;
  }

  handleNameChange( e ){
    this.setState({ name : e.target.value });
  }

  handleDescriptionChange( e ){
    this.setState({ description : e.target.value });
  }

  render() {
    return editProject(Object.assign(
      this,
      this.state,
      this.props,
      { 
        EditContent: React.createFactory(EditContent),
        EditTitle: React.createFactory(EditTitle),
        getImage: this.getImage.bind(this)
      }
    ));
  }

  componentWillMount(){
    ProjectActionCreator.getAllProjects();
  }

  componentDidMount(){
    State.transition("pages");
  }

  componentWillUpdate(){
    return {
    };
  }

  componentDidUpdate(){
    return {
    };
  }

  componentWillUnmount(){
  }
}

EditProject.contextTypes = {
  router: React.PropTypes.func
};
module.exports = EditProject;
