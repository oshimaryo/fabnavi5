//こちらが、プロジェクトの部分かな
import React from 'react';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import projectElement from '../templates/ProjectElement.jade';

const ProjectElement = React.createClass({

  propTypes : {
  },

  getInitialState: function(){
    return null;
  },

  getDefaultProps: function(){
    return {
    };
  },

  getThumbnailSrc: function (){

    let src = null;

    if( this.props.project.hasOwnProperty("figure") ){
      const thumb = this.props.project.figure;
      if( thumb.hasOwnProperty("attachment") ){
        src = this.props.project.figure.attachment.file.thumb;
      }
    }

    if( src == null || src == "" ){
      src = "/images/kaffcop_icon/fab_samp.jpg";
    }
    return src;
  },

  getUserIconSrc: function (){
    let src = null;
    const userName = this.props.project.user.email.replace(/@.*$/,"")
    if( src == null ){
      src = "https://github.com/" + userName + ".png";
    }
    return src;
  },

  render : projectElement,

  handleChange: function ( event ){
  },

  handleClick : function( event ){
    ProjectActionCreator.playProject( this.props.project );
  },

  componentWillMount : function(){
  },

  componentDidMount : function (){
  },

  componentWillUpdate : function(){
  },

  componentDidUpdate : function(){
  },

  componentWillUnmount : function(){
  },
});

module.exports = ProjectElement;
