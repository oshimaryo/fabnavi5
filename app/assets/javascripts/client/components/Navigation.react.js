import React from 'react';
import MenuIcon from './MenuIcon.react.js';
import AccountStore from '../stores/AccountStore';

import { Router, Link } from 'react-router';

import navigation from '../templates/Navigation.jade';

class Navigation extends React.Component {

  constructor(props){
    super(props);
    this.props = {headerSrc : "images/fav_logo_3.png"};
    this.state = {account: AccountStore.getAccountInfo()};
    this._onChange = this._onChange.bind(this);
  }

  _onChange(){
    this.setState({account: AccountStore.getAccountInfo()});
  }

  render(){
    return navigation(Object.assign(
      this,
      this.state,
      this.props,
      {MenuIcon: React.createFactory(MenuIcon)}
    ));
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
