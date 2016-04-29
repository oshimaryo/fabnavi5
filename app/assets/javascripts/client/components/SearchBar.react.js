import NavigationViewActionCreator from '../actions/NavigationViewActionCreator';
import React from 'react';
import searchBar from '../templates/SearchBar.jade';

const SearchBar = React.createClass({

  propTypes : {
  },

  getInitialState: function(){
    return {
    };
  },

  getDefaultProps: function(){
    return {

    };
  },

  render : searchBar,
  handleChange: function ( event ){
    NavigationViewActionCreator.search( "", event.target.value );
  },

  onclick : function(){
  },

  componentWillMount : function(){
  },

  componentDidMount : function(){
  },

  componentWillUpdate : function(){
  },

  componentDidUpdate : function(){
  },

  componentWillUnmount : function(){
  },

});

module.exports = SearchBar;
