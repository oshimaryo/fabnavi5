var React = require('react');
var jade = require('react-jade');
var footer = jade.compileFile(__dirname + '/../templates/Footer.jade');

var Router = require('react-router');
var Link = Router.Link;

var Footer = React.createClass({

  propTypes : {
  },

  getInitialState: function(){
    return {
    };
  },

  getDefaultProps: function(){
    return {
      footerText : "fabnavi",
    };
  },

  render : footer,

  handleChange: function( event ){
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

module.exports = Footer;
