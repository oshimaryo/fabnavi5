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
import Footer from './Footer';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import ProjectDetail from './ProjectDetail';
import ProjectStore from '../stores/ProjectStore';
import WebAPIUtils from '../utils/WebAPIUtils';
import ServerActionCreator from '../actions/ServerActionCreator';
import reducer from '../reducers/index';
import { handleKeyDown } from '../actions/KeyActionCreator';

const debug = Debug('fabnavi:jsx:FabnaviApp');
import { Router, Route, IndexRedirect, IndexRoute, Redirect, browserHistory } from 'react-router';

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
window.browserHistory = browserHistory;
window.addEventListener('DOMContentLoaded', () => {

  // ProjectStore.init();
  debug('init App', store);
  api.setDispatch(store.dispatch);
  api.getAllProjects();
  ReactDOM.render(routes, document.querySelector('#mount-point'));

  if(WebAPIUtils.isSigningIn()) {
    const uid = WebAPIUtils.isSigningIn.uid;
    ServerActionCreator.signIn(uid);
  }

  window.addEventListener('keydown', handleKeyDown(store));
});
