//こちらが、プロジェクトの部分かな
const
    React = require('react'),
    jade = require('react-jade'),
    projectElement = jade.compileFile(__dirname + '/../templates/ProjectElement.jade'),
    ProjectActionCreator = require('../actions/ProjectActionCreator');

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
