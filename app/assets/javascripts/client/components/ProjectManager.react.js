import React from 'react';

import Navigation from './Navigation.react';
import SearchBar from './SearchBar.react';
import ProjectList from './ProjectList.react';
import Player from './Player.react.js';
import Frame from './Frame.react.js';
import Footer from './Footer.react.js';

import { Router, Route, RouteHandler, Link, DefaultRoute } from 'react-router';
import State from '../utils/FabnaviStateMachine';
import projectManager from '../templates/ProjectManager.jade';

const ProjectManager = React.createClass({
  render: projectManager,
  componentDidMount : function(){

  },

  componentWillUpdate : function(){
  },

  componentDidUpdate : function(){
  },

  componentWillUnmount : function(){
  },

});

module.exports = ProjectManager;
