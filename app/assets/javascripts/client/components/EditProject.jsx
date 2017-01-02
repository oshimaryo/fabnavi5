import React from 'react';
import ProjectListStore from '../stores/ProjectListStore';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import { Route, RouteHandler, Link, DefaultRoute } from 'react-router';
import State from'../utils/FabnaviStateMachine';
import EditContent from './EditContent';
import EditTitle from './EditTitle';

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
    const contents = this.getImage();
    return (
<div className="editproject">
<h1>Edit Project</h1>
<hr/>
<EditTitle 
  id_name={contents.project_id.name}
  id_description={contents.project_id.description}
  id_project={contents.project_id}
  isPrivate={contents.project_id["private"] || false}>
    
  </EditTitle>
  <hr/>
  <h1 class="subtitle">Delete Project </h1>
  <button class="btn" type="submit" onClick={this.onclick}>
      D E L E T E
  </button>
  <div class="edit-pic">
    
  </div>
</div>
      );

  }

  componentWillMount(){
    ProjectActionCreator.getAllProjects();
  }

  componentDidMount(){
    ProjectStore.addChangeListener(this._onChange);
    State.transition("pages");
  }


  componentWillUnmount(){
    ProjectStore.removeChangeListener(this._onChange);
  }
}

EditProject.contextTypes = {
  router: React.PropTypes.func
};
module.exports = EditProject;
