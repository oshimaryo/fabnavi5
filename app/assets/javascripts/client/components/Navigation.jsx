import React from 'react';
import { Router, Link } from 'react-router';
import Debug from 'debug';
import { connect } from 'react-redux';

import MenuIcon from './MenuIcon';

const debug = Debug("fabnavi:jsx:Navigation");

class Navigation extends React.Component {

  constructor(props) {
    super(props);
  }


  render() {
    const menu = this.props.user.isLoggedIn ? (
      <div className="menu" >
        <MenuIcon act="MOVE_TOP" src="images/kaffcop_icon/fab_home.png" />
        <MenuIcon act="MOVE_MY_PROJECTS" src="images/kaffcop_icon/fab_mypro.png"/>
        <MenuIcon act="SIGN_OUT" src="images/kaffcop_icon/fab_out.png" />
      </div>
    ) : (
      <div className="menu" >
        <MenuIcon act="MOVE_TOP" src="images/kaffcop_icon/fab_home.png" />
        <MenuIcon act="SIGN_IN" src="images/kaffcop_icon/fab_in.png" />
      </div>
    );

    return (
      <div className="header">
        <a className="logo" href="#/manager" >
          <img src="images/fav_logo_3.png" />
        </a>
        {menu}
      </div>
    );
  }

  componentWillMount() {
  }

  componentDidMount() {
  }

  componentWillUpdate() {
  }

  componentDidUpdate() {
  }

}

function mapStateToProps(state) {
  return state;
}

export default connect(mapStateToProps)(Navigation);

