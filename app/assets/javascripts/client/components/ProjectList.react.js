//プロジェクトたちをリストにしている所？
//最初のページとも言える
var React = require('react');
var ProjectListStore = require('../stores/ProjectListStore');
var ProjectSelectorStore = require('../stores/ProjectSelectorStore');
var ProjectElement = require('../components/ProjectElement.react');
var jade = require('react-jade');
var projectList = jade.compileFile(__dirname + '/../templates/ProjectList.jade');
var ProjectActionCreator = require('../actions/ProjectActionCreator');

var State = require('../utils/FabnaviStateMachine');

var ProjectList = React.createClass({

  propTypes : {

  },

  getStateFromStores : function (){
    return {
      projects : ProjectListStore.getProjectsAll(),
      selected : ProjectSelectorStore.getSelector(),
    };
  },

  _onChange : function (){
    this.setState(this.getStateFromStores());
  },

  getInitialState: function(){
    return this.getStateFromStores();
  },

  getDefaultProps: function(){
    return {
    };
  },

  render : projectList,

  handleChange: function( event ){
  },

  onclick : function(){
  },

  componentWillMount : function(){
    ProjectActionCreator.getAllProjects();
  },

  componentDidMount : function(){
    ProjectListStore.addChangeListener(this._onChange);
    ProjectSelectorStore.addChangeListener(this._onChange);
    State.reload();
  },

  componentWillUpdate : function(){
  },


  componentDidUpdate : function(){
  },

  componentWillReceiveProps : function(){
  },

  componentWillUnmount : function(){
    ProjectListStore.removeChangeListener(this._onChange);
    ProjectSelectorStore.removeChangeListener(this._onChange);
  },

});

module.exports = ProjectList;
