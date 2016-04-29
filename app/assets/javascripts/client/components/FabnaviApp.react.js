import React from 'react';
import ReactDOM from 'react-dom';
import {render } from 'react-dom';

import Navigation from './Navigation.react';
import SearchBar  from './SearchBar.react';
import ProjectList  from './ProjectList.react';
import ProjectManager  from './ProjectManager.react';
import Player  from './Player.react.js';
import Frame  from './Frame.react.js';
import Footer  from './Footer.react.js';
import CreateProject  from './CreateProject.react.js';
import EditProject  from './EditProject.react.js';
import ProjectDetail  from './ProjectDetail.react.js';
import ProjectStore  from '../stores/ProjectStore';
import WebAPIUtils  from '../utils/WebAPIUtils';
import ServerActionCreator from '../actions/ServerActionCreator';
import { Router, Route, DefaultRoute, Link, RouteHandler, NotFoundRoute, Redirect } from 'react-router';

const routes = React.createElement(Route, { handler: Frame, path: "/" },
    //以下は、メニューバーがついたページの描画
  React.createElement(Route, { handler: ProjectManager, name: "manager" },
    React.createElement(Route, { handler: ProjectList, name: "index" }),
    React.createElement(Route, { handler: CreateProject, name: "create" }),
    React.createElement(Route, { handler: EditProject, name: "edit", path: "edit/:projectId" }),
    React.createElement(Route, { handler: ProjectDetail, name: "project", path:"project/:projectId" }),
    React.createElement(DefaultRoute, { handler: ProjectList }),
    React.createElement(NotFoundRoute, { handler: ProjectList })
  ),
  //以下は、プレイヤーのページの描画
  React.createElement(Route, { handler: Player, name: "player", path:"project/play/:projectId" }),
  React.createElement(Redirect, { from: "/", to:"/manager" }),
  React.createElement(NotFoundRoute, { handler: ProjectManager })
);

//ProjectStoreのinitと, 上で定義されたroutesを基に, Reactをdocument.body以下に展開する
global.onload = function ( ){
  console.log("Fabnavi boot");
  ProjectStore.init();
//  Router.run(routes, function(Handler){
//    React.render(React.createElement(Handler, null), document.body);
//  });
  render(routes,document.body);
  if(WebAPIUtils.isSigningIn()){
    const uid = WebAPIUtils.isSigningIn.uid;
    ServerActionCreator.signIn(uid);
  }
}
