// defaultで表示するcomponent
import React, {Component, PropTypes} from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate'
import Debug from 'debug';

import ProjectElement from '../components/ProjectElement';
import Pagination from '../components/Pagination.jsx';

const debug = Debug('fabnavi:jsx:ProjectList');
// component
// 3回読み込まれている（なんで？）
class ProjectList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const selector = this.props.selector;
    console.log('--- projectList is generated ---' );
    console.dir(this.props);
    console.log('props.selector');
    console.log(this.props.selector);

    return (
      <div>
        <div className="projects">
        {this.props.projects.map((project, index) =>
          <ProjectElement
            key={index}
            project={project}
            isSelected={selector.index == index}
            isOpenMenu={selector.index == index && selector.openMenu}
            menuIndex={selector.menuIndex}
            menuType={selector.menuType} />
            )
        }
        </div>
        <div className="pagination">
          <Pagination />
        </div>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if(nextProps.isFetching) {
      return;
    }
    if(this.props.route['path'] !== nextProps.route['path']) {
      if(nextProps.route['path'] === 'myprojects') {
        api.getOwnProjects();
      } else {
        api.getAllProjects();
      }
    }
  }

  componentWillMount() {
    if(this.props.projects.length !== 0) {
      return;
    }
    if(this.props.route['path'] === 'myprojects') {
      api.getOwnProjects();
    } else {
      api.getAllProjects();
    }
  }

  componentDidUpdate() {
  }
}

function mapStateToProps(state) {
  return {
    isFetching: state.manager.isFetching,
    projects: state.manager.projects,
    selector: state.manager.selector
  };
}

export default connect(mapStateToProps)(ProjectList);
