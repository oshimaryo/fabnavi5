import React from 'react';
import ReactDOM from 'react-dom';
import {render } from 'react-dom';

import Navigation from './Navigation.react';
import SearchBar  from './SearchBar.react';
import ProjectList  from './ProjectList.react';
import ProjectManager  from './ProjectManager.react';
import Player  from './Player.react.js';
import Footer  from './Footer.react.js';
import CreateProject  from './CreateProject.react.js';
import EditProject  from './EditProject.react.js';
import ProjectDetail  from './ProjectDetail.react.js';
import ProjectStore  from '../stores/ProjectStore';
import WebAPIUtils  from '../utils/WebAPIUtils';
import ServerActionCreator from '../actions/ServerActionCreator';
import { Router, Route, DefaultRoute, Link, RouteHandler, NotFoundRoute, Redirect, hashHistory } from 'react-router';

const routes = (
  <Router history={hashHistory}>
      <Route components={ProjectManager} path="/" />
  </Router>
);

/*
React.createElement(Router, {history: hashHistory},
  React.createElement(Route, { component: Frame, path: "/" },
    React.createElement(Route, { component: ProjectManager, name: "manager" },
      React.createElement(Route, { component: ProjectList, name: "index" }),
      React.createElement(Route, { component: CreateProject, name: "create" }),
      React.createElement(Route, { component: EditProject, name: "edit", path: "edit/:projectId" }),
      React.createElement(Route, { component: ProjectDetail, name: "project", path:"project/:projectId" }),
      React.createElement(DefaultRoute, { component: ProjectList }),
      React.createElement(NotFoundRoute, { component: ProjectList })
    ),
    React.createElement(Route, { component: Player, name: "player", path:"project/play/:projectId" }),
    React.createElement(Redirect, { from: "/", to:"/manager" }),
    React.createElement(NotFoundRoute, { component: ProjectManager })));

    */
//ProjectStoreのinitと, 上で定義されたroutesを基に, Reactをdocument.body以下に展開する
global.onload = function ( ){
  ProjectStore.init();
//  Router.run(routes, function(Handler){
//    React.render(React.createElement(Handler, null), document.body);
//  });
  render(routes, document.body);
  if(WebAPIUtils.isSigningIn()){
    ServerActionCreator.signIn();
  }
  if(WebAPIUtils.SignOut()){
    ServerActionCreator.signOut();
  }
}
