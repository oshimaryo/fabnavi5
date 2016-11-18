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
        <Redirect from="/" to="manager" />
        <Route components={ProjectManager} path="manager" >
          <IndexRoute component={ProjectList} />
          <Route component={ProjectList} path="myprojects" />
          <Route component={CreateProject} path="create"/>
          <Route component={transit} path="transit"/>
          <Route component={EditProject} path="edit/:projectId" />
          <Route component={ProjectDetail} path="detail/:projectId" />
        </Route>
        <Route components={Player} path="project/play/:projectId" />
      </Route>
  </Router>
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
