
import React from 'react';
import Debug from 'debug';

import NavigationViewActionCreator from '../actions/NavigationViewActionCreator';

const debug = Debug('fabnavi:jsx:MenuIcon');

export default class MenuIcon extends React.Component {

  constructor(props) {
    super(props);
    this.onclick = () => {
      NavigationViewActionCreator.menuSelect(this.props.act);
    }
  }

  render() {
    return (
      <a className="menu-action nav-action"
        onClick={this.onclick} >
        <img src={this.props.src} />
      </a>
    );
  }
}