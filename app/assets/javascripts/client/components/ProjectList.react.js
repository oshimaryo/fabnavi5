//プロジェクトたちをリストにしている所？
//最初のページとも言える
import React from 'react';
import ProjectListStore from '../stores/ProjectListStore';
import ProjectSelectorStore from '../stores/ProjectSelectorStore';
import ProjectElement from '../components/ProjectElement.react';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import projectList from '../templates/ProjectList.jade';

import State from '../utils/FabnaviStateMachine';

class ProjectList extends React.Component{

  constructor(props){
    super(props);
    this.getStateFromStores = this.getStateFromStores.bind(this);
    this.state = this.getStateFromStores();
    this.props = {};
    this._onChange = this._onChange.bind(this);
  }

  getStateFromStores(){
    return {
      projects : ProjectListStore.getProjectsAll(),
      selected : ProjectSelectorStore.getSelector(),
      projectsType : ProjectListStore.getProjectsType(),
    };
  }

  _onChange(){
    this.setState(this.getStateFromStores());
  }

  render(){
    return projectList(Object.assign(
      this,
      this.state,
      this.props,
      {ProjectElement: React.createFactory(ProjectElement)}
    ));
  }

  componentWillMount(){
    ProjectActionCreator.getAllProjects();
    ProjectListStore.loadProjects(); // XXX
  }

  componentDidMount(){
    ProjectListStore.addChangeListener(this._onChange);
    ProjectSelectorStore.addChangeListener(this._onChange);
    State.reload();
  }

  componentWillUpdate(){
  }


  componentDidUpdate(){
  }

  componentWillReceiveProps(){
  }

  componentWillUnmount(){
    ProjectListStore.removeChangeListener(this._onChange);
    ProjectSelectorStore.removeChangeListener(this._onChange);
  }

}

export default ProjectList;
