//プロジェクトたちをリストにしている所？
//最初のページとも言える
const
    React = require('react'),
    ProjectListStore = require('../stores/ProjectListStore'),
    ProjectSelectorStore = require('../stores/ProjectSelectorStore'),
    ProjectElement = require('../components/ProjectElement.react'),
    jade = require('react-jade'),
    projectList = jade.compileFile(__dirname + '/../templates/ProjectList.jade'),
    ProjectActionCreator = require('../actions/ProjectActionCreator'),

    State = require('../utils/FabnaviStateMachine');

const ProjectList = React.createClass({

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
    ProjectListStore.loadProjects();
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
