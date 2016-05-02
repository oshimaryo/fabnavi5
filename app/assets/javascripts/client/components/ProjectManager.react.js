import React from 'react';

import Navigation from './Navigation.react';
import SearchBar from './SearchBar.react';
import ProjectList from './ProjectList.react';
import Player from './Player.react.js';
import Frame from './Frame.react.js';
import Footer from './Footer.react.js';

import { Router, Route, DefaultRoute } from 'react-router';
import State from '../utils/FabnaviStateMachine';
import projectManager from '../templates/ProjectManager.jade';

class ProjectManager extends React.Component {


  constructor(props){
    super(props);
    this.state = {};
  }

  render(){
   return projectManager(Object.assign(
         this,
         this.state,
         this.props,
         {Navigation: React.createFactory(Navigation)},
         {ProjectList: React.createFactory(ProjectList)},
         {SearchBar: React.createFactory(SearchBar)},
         {Footer: React.createFactory(Footer)}));
  }
  componentDidMount(){
  }

  componentWillUpdate(){
  }

  componentDidUpdate(){
  }

  componentWillUnmount(){
  }
}

export default ProjectManager;
