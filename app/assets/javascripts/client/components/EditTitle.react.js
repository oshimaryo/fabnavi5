const
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    React = require('react'),
    Router = require('react-router'),
    Link = Router.Link,
    Route = Router.Route;

import editTitle from '../templates/EditTitle.jade';

const EditTitle = React.createClass({
  propTypes : {
    id   : React.PropTypes.number.isRequired,
    src   : React.PropTypes.string.isRequired,
    id_array : React.PropTypes.array.isRequired,
  },

  getInitialState: function(){
    return {
      name:this.props.id_name,
      description:this.props.id_description,
      private: this.props.isPrivate
    };
  },

  getDefaultProps: function(){
    return {
    };
  },

  onclick : function(){
    console.log("this is title changed fucntion :" + this.state.name);
    console.log(this.props.id_project);
    console.log(this.state);
    ProjectActionCreator.editTitle(this.props.id_project, this.state.name, this.state.description, this.state.private);
    return;
  },

  handleNameChange : function( e ){
    this.setState({ name : e.target.value });
  },

  handlePublishStatusChange : function( e ){
    this.setState({ private: e.target.checked });
  },

  handleDescriptionChange : function( e ){
    this.setState({ description : e.target.value });
  },

  render : editTitle,

  componentWillMount : function(){
    return {
    };
  },

  componentDidMount : function (){
    //State.reload();
  },

  componentWillUpdate : function(){
    return {
    };
  },

  componentDidUpdate : function(){
  },

  componentWillUnmount : function(){
    return {
    };
  },

});

module.exports = EditTitle;
