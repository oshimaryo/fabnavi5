//プロジェクトたちをリストにしている所？
//最初のページとも言える
import React from 'react';
import ProjectListStore from '../stores/ProjectListStore';
import ProjectSelectorStore from '../stores/ProjectSelectorStore';
import ProjectElement from '../components/ProjectElement.react';
import ProjectActionCreator from '../actions/ProjectActionCreator';
import projectList from '../templates/ProjectList.jade';

import State from '../utils/FabnaviStateMachine';

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
