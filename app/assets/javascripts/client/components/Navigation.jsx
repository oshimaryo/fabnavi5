import React from'react';
import MenuIcon from'./MenuIcon';
import AccountStore from'../stores/AccountStore';

import{ Router, Link }from'react-router';


class Navigation extends React.Component{

  constructor(props){
    super(props);
    this.state = { account: AccountStore.getAccountInfo() };
    this._onChange = this._onChange.bind(this);
  }

  _onChange(){
    this.setState({ account: AccountStore.getAccountInfo() });
  }

  render(){
    const menu = this.state.account.uid != "" ? (
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
  <a className="logo"
    href="#/manager" >
    <img src="images/fav_logo_3.png" />
  </a>
  {menu}
    </div>
    );
  }

  componentWillMount(){
  }

  componentDidMount(){
    AccountStore.addChangeListener(this._onChange);
  }

  componentWillUpdate(){
    return {
    };
  }

  componentDidUpdate(){
    return {
    };
  }

  componentWillUnmount(){
    AccountStore.removeChangeListener(this._onChange);
  }
}

export default Navigation;
