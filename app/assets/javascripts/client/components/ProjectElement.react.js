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
    if(this.props.project.content.length>=1){
      src = this.props.project.content[this.props.project.content.length-1].figure.file.file.thumb.url;
    }
/*
    if( this.props.project.hasOwnProperty("figure") ){
      const thumb = this.props.project.figure;
      if( thumb.hasOwnProperty("attachment") ){
        src = this.props.project.figure.attachment.file.thumb;
      }
    }
*/
    if( src == null || src == "" ){
      src = "/images/kaffcop_icon/no_thumbnail.png";
    }
    return src;
  },

  getUserIconSrc: function (){
    let src = null;
    if( src == null ){
      src = this.props.project.user.image;
    }
  return src;
  },

  render : projectElement,

  handleChange: function ( event ){
  },

  handleClick : function( event ){
    ProjectActionCreator.playProject( this.props.project );
  },

  getUploadDate : function(){
    return this.props.project.created_at.replace(/T.*$/,"").replace(/-/g," / ");
  },

  getDescription: function(){
    if( this.props.project.description.length>=100 ){
      return this.props.project.description.substr(0,100) + " . . ." ;
    }else{
      return this.props.project.description;
    }
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
