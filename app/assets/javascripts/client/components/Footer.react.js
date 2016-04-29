import React from 'react';
import footer from '../templates/Footer.jade';
import { Link } from 'react-router';

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
