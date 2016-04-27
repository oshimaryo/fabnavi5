var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventEmitter = require('events');
var _projects = [];
var initProjects = [];
var searchProjects = [];
var EventTypes = require('../constants/EventTypes');
var ActionTypes = require('../constants/ActionTypes');
var ProjectActionCreator = require('../actions/ProjectActionCreator');

var ProjectListStore = Object.assign({}, EventEmitter.prototype, {
  init : function(){
    _projects = [];
    ProjectActionCreator.getAllProjects();
    this.emitChange();
  },

  getProjectsAll : function(){
    return _projects;
  },

  emitChange : function(){
    this.emit(EventTypes.PROJECT_LIST_CHANGE);
  },

  initProjects : function(projects){
    initProjects = projects;
    console.log("init : " + initProjects.length);
  },

  setProjects : function( projects ){
    _projects = projects;
    this.emitChange();
  },

  removeProject : function( project ){
    for( var i = 0; i < _projects.length; i++ ){
      if( _projects[i].id == project.id ){
        _projects.splice(i, 1);
        this.emitChange();
        return;
      }
    }
  },

  searchProject : function( searchText ){
    searchProjects = [];
    var re = new RegExp(searchText, 'i');
    if(searchText === ""){
      _project = initProjects;
    } else {
      for(var i = 0; i < initProjects.length; i++){
        if(re.test(initProjects[i].name) == true){
          searchProjects.push(initProjects[i]);
          _project = searchProjects;
        }
      }
    }
    this.setProjects(_project);
    return;
  },

  addChangeListener: function(callback){
    this.on(EventTypes.PROJECT_LIST_CHANGE, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(EventTypes.PROJECT_LIST_CHANGE, callback);
  },
});

ProjectListStore.dispatchToken = AppDispatcher.register(function( action ){
  switch(action.type){
    case ActionTypes.PROJECTS_RECEIVE:
      ProjectListStore.setProjects(action.projects);
      ProjectListStore.initProjects(action.projects);
      break;
    case ActionTypes.PROJECT_DELETE_SUCCESS:
      ProjectListStore.removeProject(action.project);
      break;
    case ActionTypes.PROJECT_SEARCH:
      ProjectListStore.searchProject(action.text);
      break;
    default :
      break;
  };

});

ProjectListStore.init();
module.exports = ProjectListStore;
