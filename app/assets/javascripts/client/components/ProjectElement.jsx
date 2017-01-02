import React from'react';

import ProjectActionCreator from'../actions/ProjectActionCreator';

export default class ProjectElement extends React.Component {

  getThumbnailSrc() {

    let src = null;
    try{
      if(this.props.project.content.length >= 1) {
        src = this.props.project.content[this.props.project.content.length - 1].figure.file.file.thumb.url;
      }
      if( src == null || src == "" ) {
        src = "/images/kaffcop_icon/no_thumbnail.png";
      }
      return src;
    } catch(e) {
      return "/images/kaffcop_icon/no_thumbnail.png";
    }
  }

  getUserIconSrc () {
    let src = null;
    if( src == null ) {
      src = this.props.project.user.image;
    }
    return src;
  }

  render() {
    const actions = this.props.isOpenMenu && this.props.menuType == "allProjects" ? (
      <ul className="actions">
        <li
          className={`action-box ${this.props.menuIndex == 0 ? "selected-action" : "action"}`}
          style="border-radius: 5px 5px 0px 0px;" >
          <div className="menu2">
            <img src="/images/p_play.png" />
            Play
          </div>
        </li>
        <li className={`action-box ${this.props.menuIndex == 1 ? "selected-action" : "action"}`}>
          <div className="menu2">
            <img src="/images/p_detail.png" />
            Detail
          </div>
        </li>
      </ul>
    ) : (
      <ul className="actions">
        <li className={`action-box ${this.props.menuIndex == 0 ? "selected-action" : "action"}`}>
          <div className="menu5">
            <img src="/images/p_play.png" />
            Play
          </div>
        </li>
        <li className={`action-box ${this.props.menuIndex == 1 ? "selected-action" : "action"}`}>
          <img src="/images/p_record.png" />
          Record
        </li>
        <li className={`action-box ${this.props.menuIndex == 1 ? "selected-action" : "action"}`}>
          <div className=".menu5">
            <img src="/images/p_detail.png" />
            Detail
          </div>
        </li>
        <li className={`action-box ${this.props.menuIndex == 2 ? "selected-action" : "action"}`}>
          <div className="menu5">
            <img src="/images/p_edit.png" />
            Edit
          </div>
        </li>
        <li className={`action-box ${this.props.menuIndex == 3 ? "selected-action" : "action"}`}>
          <div className="menu4">
            <img src="/images/p_delete.png" />
            Delete
          </div>
        </li>
      </ul>);

    return (
      <div className={`project-box ${this.props.isSelected ? "selected-project" : ""}`}>
        <div className="thumbnail">
          <img src={this.getThumbnailSrc()}/>
        </div>
        <h1 className="project-name">
          {this.props.project.name}
        </h1>
        <hr/>
        <div className="box">
          <img className="user-icon" src={this.getUserIconSrc()}/>
          <div className="username">
            {this.props.project.user.nickname}
          </div>
          <div className="date">
            {this.getUploadDate()}
          </div>
          <div className="description">
            {this.getDescription()}
          </div>
        </div>
      </div>
    );
  }

  handleChange( event ) {
  }

  handleClick ( event ) {
    ProjectActionCreator.playProject( this.props.project );
  }

  getUploadDate() {
    return this.props.project.created_at.replace(/T.*$/, "").replace(/-/g, " / ");
  }

  getDescription() {
    if( !this.props.project.description ) {
      return "";
    }

    if( this.props.project.description.length >= 100 ) {
      return this.props.project.description.substr(0, 100) + " . . .";
    }

    return this.props.project.description;
  }
}
