const
    React = require('react'),
    jade = require('react-jade'),
    footer = jade.compileFile(__dirname + '/../templates/Footer.jade'),
    Router = require('react-router'),
    Link = Router.Link;

const Footer = React.createClass({

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
