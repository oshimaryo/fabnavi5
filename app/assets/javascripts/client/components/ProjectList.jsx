import React from 'react';
import { connect } from 'react-redux';
import Debug from 'debug';

import ProjectElement from '../components/ProjectElement';

const debug = Debug('fabnavi:jsx:ProjectList');
class ProjectList extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    const
        projects = this.props.manager.projects,
        selector = this.props.manager.selector,
        projectElements = []
        ;

    let i;
    for(i in projects) {
      projectElements.push(
        <ProjectElement
          key={i}
          project={projects[i]}
          isSelected={selector.index == i}
          isOpenMenu={selector.index == i && selector.openMenu}
          menuIndex={selector.menuIndex}
          menuType={selector.menuType} />
      );
    }
    return (
      <div className="projects">
        {projectElements}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(ProjectList);
