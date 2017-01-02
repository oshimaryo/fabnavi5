import React from'react';
import ReactDOM from'react-dom';
import{ render }from'react-dom';

import Navigation from'./Navigation';
import SearchBar from'./SearchBar';
import ProjectList from'./ProjectList';
import ProjectManager from'./ProjectManager';
import Player from'./Player';
import Footer from'./Footer';
import Frame from'./Frame';
import CreateProject from'./CreateProject';
import EditProject from'./EditProject';
import ProjectDetail from'./ProjectDetail';
import ProjectStore from'../stores/ProjectStore';
import WebAPIUtils from'../utils/WebAPIUtils';
import ServerActionCreator from'../actions/ServerActionCreator';
import{ Router, Route, IndexRoute, Redirect, hashHistory }from'react-router';
const transit = React.createClass({
  render : function() { return null }
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

global.onload = function ( ) {
  ProjectStore.init();
  render(routes, document.querySelector("#mount-point"));
  if(WebAPIUtils.isSigningIn()) {
    const uid = WebAPIUtils.isSigningIn.uid;
    ServerActionCreator.signIn(uid);
  }
}
