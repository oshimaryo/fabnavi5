// defaultで表示するcomponent
import React, { Component, PropTypes, cloneElement } from 'react';
import { connect } from 'react-redux';
import ReactPaginate from 'react-paginate'
import Debug from 'debug';

import ProjectElement from '../components/ProjectElement';
import Pagination from '../components/Pagination.jsx';
import ShowingResults from '../components/ShowingResults.jsx';

const debug = Debug('fabnavi:jsx:ProjectList');

class ProjectList extends Component {

  constructor(props) {
    super(props);
  }

  render() {
    const selector = this.props.selector;

    return (
        <div className="projects">
            <Pagination data={this.props.projects} selector={selector}>
              <ShowingResults />
            </Pagination>
      </div>
    );
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.isFetching) {
      return;
    }
    if (this.props.route['path'] !== nextProps.route['path']) {
      if (nextProps.route['path'] === 'myprojects') {// myProjectの場合，自分が作成したprojectのみを引っ張ってくる
        api.getOwnProjects();
      } else {
        api.getAllProjects();
      }
    }
  }

  componentWillMount() {
    if (this.props.projects.length !== 0) {
      return;
    }
    if (this.props.route['path'] === 'myprojects') {
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
