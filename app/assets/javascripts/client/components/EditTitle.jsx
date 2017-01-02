
import React from"react";
import{ Link, Route }from'react-router';

import ProjectActionCreator from'../actions/ProjectActionCreator';

export default class EditTitle extends React.Component {

  constructor(props) {
    super(props);
  }

  getInitialState() {
    return {
      name:this.props.id_name,
      description:this.props.id_description,
      private: this.props.isPrivate
    };
  }

  onclick () {
    ProjectActionCreator.editTitle(this.props.id_project, this.state.name, this.state.description, this.state.private);
    return;
  }

  handleNameChange ( e ) {
    this.setState({ name : e.target.value });
  }

  handlePublishStatusChange ( e ) {
    this.setState({ private: e.target.checked });
  }

  handleDescriptionChange ( e ) {
    this.setState({ description : e.target.value });
  }

  render() {
    return (
<div>
<h1 className="subtitle">
  Edit Name and Description
</h1>
<form className="form-box-edit">
  <div className="field_edit">
    <p className="edit">
      Name
    </p>
    <input
      className="form-edit"
      onChange={this.handleNameChange}
      value="this.state.name"
      type="text"/>
  </div>
  <div className="field_edit">
    <p className="edit">Private?</p>
    <input onChange="this.handlePublishStatusChange" type="checkbox"/>
  </div>
  <div className="field_edit">
    <p className="edit">Description</p>
    <textarea
      className="form-edit"
      onChange="this.handleDescriptionChange"
      value="this.state.description"
      rows="10">

    </textarea>
  </div>
</form>
<button className="btn" type="submit" onClick="this.onclick">
  S A V E
</button>
</div>
      );
  }
}