import React from 'react';
import MenuIcon from './MenuIcon.react.js';
import AccountStore from '../stores/AccountStore';

import { Router, Link } from 'react-router';

import navigation from '../templates/Navigation.jade';

const Navigation = React.createClass({

  getStateFromStores : function getStateFromStores(){
    return {
      account : AccountStore.getAccountInfo()
    };
  },

  _onChange : function (){
    this.setState(this.getStateFromStores());
  },
  getInitialState: function(){
    return this.getStateFromStores();
  },

  getDefaultProps: function(){
    return {
      headerSrc : "images/fav_logo_3.png",
    };
  },

  render : navigation,

  componentWillMount : function(){
  },

  componentDidMount : function (){
    AccountStore.addChangeListener(this._onChange);
  },

  componentWillUpdate : function(){
    return {
    };
  },

  componentDidUpdate : function(){
    return {
    };
  },

  componentWillUnmount : function(){
    AccountStore.removeChangeListener(this._onChange);
  },
});

module.exports = Navigation;
