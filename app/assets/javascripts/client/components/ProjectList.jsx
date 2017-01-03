import React from 'react';

import ProjectListStore from '../stores/ProjectListStore';
import ProjectSelectorStore from '../stores/ProjectSelectorStore';
import ProjectElement from '../components/ProjectElement';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import State from '../utils/FabnaviStateMachine';
import Debug from 'debug';

const debug = Debug("fabnavi:jsx:ProjectList");
class ProjectList extends React.Component {

  constructor(props) {
    super(props);
    this.getStateFromStores = this.getStateFromStores.bind(this);
    this.state = this.getStateFromStores();
    this.props = {};
    this._onChange = this._onChange.bind(this);
  }

  getStateFromStores() {
    return {
      projects : ProjectListStore.getProjectsAll(),
      selected : ProjectSelectorStore.getSelector(),
      projectsType : ProjectListStore.getProjectsType(),
    };
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  render() {
    const projects = [];
    let i;
    for(i in this.state.projects) {
      projects.push(
        <ProjectElement
          key={i}
          project={this.state.projects[i]}
          isSelected={this.state.selected.index == i}
          isOpenMenu={this.state.selected.index == i && this.state.selected.openMenu}
          menuIndex={this.state.selected.menuIndex}
          menuType={this.state.selected.menuType} />
      );
    }
    return (
      <div className="projects">
        {projects}
      </div>
    );
  }

  componentWillMount() {
    ProjectListStore.loadProjects();
  }

  componentDidMount() {
    ProjectListStore.addChangeListener(this._onChange);
    ProjectSelectorStore.addChangeListener(this._onChange);
    State.reload();
  }

  componentWillUpdate() {
  }


  componentDidUpdate() {
  }

  componentWillReceiveProps() {
  }

  componentWillUnmount() {
    ProjectListStore.removeChangeListener(this._onChange);
    ProjectSelectorStore.removeChangeListener(this._onChange);
  }

}

export default ProjectList;
