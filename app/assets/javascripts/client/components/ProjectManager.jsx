import React from 'react';

import Navigation from './Navigation';
import SearchBar from './SearchBar';
import ProjectList from './ProjectList';
import Player from './Player';
import Frame from './Frame';
import Footer from './Footer';
import Debug from 'debug';

const debug = Debug("fabnavi:jsx:ProjectManager");
import { Router, Route, DefaultRoute } from 'react-router';
import State from '../utils/FabnaviStateMachine';

class ProjectManager extends React.Component {


  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className="body">
        <Navigation />
        <SearchBar />
          {this.props.children}
        <Footer />
      </div>
    );
  }
  componentDidMount() {
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

  componentWillUnmount() {
  }
}

export default ProjectManager;
