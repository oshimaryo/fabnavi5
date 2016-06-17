import React from 'react';
import ReactDOM from 'react-dom';
import {render} from 'react-dom';

import Navigation from './Navigation.react';
import SearchBar  from './SearchBar.react';
import ProjectList  from './ProjectList.react';
import ProjectManager  from './ProjectManager.react';
import Player  from './Player.react.js';
import Footer  from './Footer.react.js';
import Frame from './Frame.react.js';
import CreateProject  from './CreateProject.react.js';
import EditProject  from './EditProject.react.js';
import ProjectDetail  from './ProjectDetail.react.js';
import ProjectStore  from '../stores/ProjectStore';
import WebAPIUtils  from '../utils/WebAPIUtils';
import ServerActionCreator from '../actions/ServerActionCreator';
import { Router, Route, IndexRoute, Redirect, hashHistory } from 'react-router';

const transit = React.createClass({
  render : function(){return null}
});

const routes = (
  <Router history={hashHistory}>
      <Route components={Frame} path="/">
        <IndexRoute component={ProjectManager} />
        <Route components={ProjectManager} path="manager" >
          <IndexRoute component={ProjectList} />
          <Route component={CreateProject} path="create"/>
          <Route component={transit} path="transit"/>
          <Route component={EditProject} path="edit/:projectId" />
          <Route component={ProjectDetail} path="project/:projectId" />
        </Route>
        <Route components={Player} path="project/play/:projectId" />
      </Route>
  </Router>

/*
 //XXX
    //ract-router
    Router = require('react-router'),
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler,
    NotFoundRoute = Router.NotFoundRoute,
    Redirect = Router.Redirect;


 //フレーム
const routes = React.createElement(Route, { handler: Frame, path: "/" },
    //以下は、メニューバーがついたページの描画
  React.createElement(Route, { handler: ProjectManager, name: "manager" },
    React.createElement(Route, { handler: ProjectList, name: "index" }),
    React.createElement(Route, { handler: transit, name: "transit" }),
    React.createElement(Route, { handler: ProjectList, name: "myprojects", path: "myprojects" }),
    React.createElement(Route, { handler: CreateProject, name: "create" }),
    React.createElement(Route, { handler: EditProject, name: "edit", path: "edit/:projectId" }),
    React.createElement(Route, { handler: ProjectDetail, name: "detail", path:"detail/:projectId" }),
    React.createElement(DefaultRoute, { handler: ProjectList }),
    React.createElement(NotFoundRoute, { handler: ProjectList })
  ),
  //以下は、プレイヤーのページの描画
  React.createElement(Route, { handler: Player, name: "player", path:"project/play/:projectId" }),
  React.createElement(Redirect, { from: "/", to:"/manager" }),
  React.createElement(NotFoundRoute, { handler: ProjectManager })
*/
);

//ProjectStoreのinitと, 上で定義されたroutesを基に, Reactをdocument.body以下に展開する
global.onload = function ( ){
  ProjectStore.init();
  render(routes, document.querySelector("#mount-point"));
  if(WebAPIUtils.isSigningIn()){
    const uid = WebAPIUtils.isSigningIn.uid;
    ServerActionCreator.signIn(uid);
  }
}
