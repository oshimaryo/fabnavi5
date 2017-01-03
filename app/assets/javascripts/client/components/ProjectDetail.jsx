import React from 'react';
import { Route, RouteHandler, Link, DefaultRoute } from 'react-router';

import ProjectListStore from '../stores/ProjectListStore';
import ProjectStore from '../stores/ProjectStore';
import State from '../utils/FabnaviStateMachine';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import Debug from 'debug';

const debug = Debug("fabnavi:jsx:ProjectDetail");
export default class ProjectDetail extends React.Component {

  constructor(props) {
    super(props);
    this.contextTypes = {
      router: React.PropTypes.func
    };
    this.getProjectDetail = () => {
      let i;
      for(i in this.state.projects) {
        if(this.state.projects[i].id == this.props.params.projectId) {
          return {
            description: this.state.projects[i].description,
            name: this.state.projects[i].name,
            username: this.state.projects[i].user.nickname,
            usericon: this.state.projects[i].user.image,
            date: this.state.projects[i].created_at.replace(/T.*$/, "").replace(/-/g, " / "),
            thumb: this.getThumbnailSrc(i)
          };
        }
      }
    };

    this.getThumbnailSrc = (a) => {
      let src = null;
      if(this.state.projects[a].content.length >= 1) {
        src = this.state.projects[a].content[this.state.projects[a].content.length - 1].figure.file.file.thumb.url;
      }
      if( src == null || src == "" ) {
        src = "/images/kaffcop_icon/no_thumbnail.png";
      }
      return src;
    }
  }

  getStateFromStoresgetStateFromStores() {
    return {
      projects : ProjectListStore.getProjectsAll(),
    };
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  getInitialState() {
    return this.getStateFromStores();
  }

  getDefaultProps() {
    return {
      hoge : "hoge",
    };
  }


  getUserIconSrc() {
    let src = null;
    if( src == null ) {
      src = this.props.project.user.image;
    }
    return src;
  }

  render() {
    const project = this.getProjectDetail();
    return (
        <div className="detail-page">
  <h1>ProjectDetail</h1>
  <hr className="detail"/>
  <div className="dtail-description">
    <div className="project-detail-box">
      <div className="thumbnail">
        <img src={project.thumb}/>
      </div>
      <h2 className="project-name">
        {this.props.project.name}
      </h2>
      <hr/>
      <div className="box">
        <img className="user-icon"/>
        <div className="username">
          {this.props.project.user.nickname}
        </div>
        <div className="date">

        </div>
      </div>
    </div>
    <h1>Description</h1>
    <p></p>
  </div>
    </div>
    );
  }

  componentWillMount() {
    ProjectActionCreator.getAllProjects();
  }

  componentDidMount() {
    ProjectStore.addChangeListener(this._onChange);
    State.transition("pages");
  }

  componentWillUnmount() {
    ProjectStore.removeChangeListener(this._onChange);
  }
}
