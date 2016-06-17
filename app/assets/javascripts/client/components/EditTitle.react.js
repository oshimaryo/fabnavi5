const
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    React = require('react'),
    jade = require('react-jade'),
    Router = require('react-router'),
    Link = Router.Link,
    Route = Router.Route,
    editTitle = jade.compileFile(__dirname + '/../templates/EditTitle.jade');

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
    };
  },

  getDefaultProps: function(){
    return {
    };
  },

  onclick : function(){
    console.log("this is title changed fucntion :" + this.state.name);
    console.log(this.props.id_project);
    ProjectActionCreator.editTitle(this.props.id_project, this.state.name, this.state.description);
    return;
  },

  handleNameChange : function( e ){
    this.setState({ name : e.target.value });
    //this.props.id_name = this.state.name;
    console.log("oioi" + this.props.id_name);
  },
  handleDescriptionChange : function( e ){
    this.setState({ description : e.target.value });
    //this.props.id_description = this.state.description;

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
