import React from 'react';
import { connect } from 'react-redux';
import Debug from 'debug';

import Action from '../actions/ProjectActionCreator';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import EditContent from './EditContent';
import ProjectEditForm from './ProjectEditForm';
import { sanitizeProject } from '../utils/projectUtils';

const debug = Debug('fabnavi:jsx:EditProject');
class EditProject extends React.Component {

  constructor(props) {
    super(props);
    this.onClick = () => {
      debug('clicked.');
    };
  }

  render() {
    const project = sanitizeProject(this.props.manager.project);
    return (
      <div className="editproject">
        <h1>Edit Project</h1>
        <hr/>
        {project ? (
        <div>
          <ProjectEditForm project={project} />
          <h1 className="subtitle">
            Delete Project
          </h1>
          <button className="btn" type="submit" onClick={this.onClick}>
            D E L E T E
          </button>

          <div className="edit-pic">

          </div>
        </div>
        ) : (
          <div> loading project... </div>
        )}
      </div>
    );
  }

  componentWillMount() {
    if(!this.props.manager.project) {
      debug('project not loaded!');
      Action.getProject({ id: location.pathname.split('/')[2] });
    }
  }
}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(EditProject);
