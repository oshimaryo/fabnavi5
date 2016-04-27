var NavigationViewActionCreator = require('../actions/NavigationViewActionCreator');
var React = require('react');
var jade = require('react-jade');
var searchBar = jade.compileFile(__dirname + '/../templates/SearchBar.jade');
var SearchBar = React.createClass({

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
