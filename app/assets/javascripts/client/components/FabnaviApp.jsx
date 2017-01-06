import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import Debug from 'debug';

import Navigation from './Navigation';
import SearchBar from './SearchBar';
import ProjectList from './ProjectList';
import ProjectManager from './ProjectManager';
import Player from './Player';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import ProjectDetail from './ProjectDetail';
import WebAPIUtils from '../utils/WebAPIUtils';

import reducer from '../reducers/index';
import { handleKeyDown } from '../actions/KeyActionCreator';

const debug = Debug('fabnavi:jsx:FabnaviApp');
import { Router, Route, IndexRoute, browserHistory } from 'react-router';

const store = createStore(reducer);

const routes = (
  <Provider store={store}>
    <Router history={browserHistory}>
        <Route components={ProjectManager} path="/" >
          <IndexRoute component={ProjectList} />
          <Route component={ProjectList} path="myprojects" />
          <Route component={CreateProject} path="create"/>
          <Route component={EditProject} path="edit/:projectId" />
          <Route component={ProjectDetail} path="detail/:projectId" />
        </Route>
        <Route components={Player} path="/play/:projectId" />
    </Router>
  </Provider>
);

window.addEventListener('DOMContentLoaded', () => {
  const url = window.location.href;
  if(isAuthWindow(url)) {
    window.opener.postMessage(JSON.stringify(parseAuthInfo(url)), window.location.origin);
    window.close();
    return;
  }
  api.init(store);
  api.getAllProjects();
  ReactDOM.render(routes, document.querySelector('#mount-point'));
  window.addEventListener('keydown', handleKeyDown(store));
});

function isAuthWindow(url) {
  return url.includes('uid') && url.includes('client_id') && url.includes('auth_token');
}

function parseAuthInfo(url) {
  return {
    'Access-Token': url.match(/auth_token=([a-zA-Z0-9\-]*)/)[1],
    'Uid': url.match(/uid=([a-zA-Z0-9\-]*)/)[1],
    'Client': url.match(/client_id=([a-zA-Z0-9\-]*)/)[1]
  };
}
