
import NavigationViewActionCreator from'../actions/NavigationViewActionCreator';
import React from'react';

import Debug from 'debug';

const debug = Debug("fabnavi:jsx:MenuIcon");
class MenuIcon extends React.Component {

  constructor(props) {
    super(props);
    this.onclick = this.onclick.bind(this);
  }

  render() {
    return (
    <a className="menu-action nav-action"
      onClick={this.onclick} >
      <img src={this.props.src} />
    </a>

      )
  }

  onclick() {
    NavigationViewActionCreator.menuSelect(this.props.act);
  }

  componentWillMount() {
    return {
    };
  }

  componentDidMount() {

  }

  componentWillUpdate() {
    return {
    };
  }

  componentDidUpdate() {
    return {
    };
  }

  componentWillUnmount() {
    return {
    };
  }

}

export default MenuIcon;
