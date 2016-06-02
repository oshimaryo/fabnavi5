const
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events'),
    EventTypes = require('../constants/EventTypes'),
    ActionTypes = require('../constants/ActionTypes'),
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    WebAPIUtils = require('../utils/WebAPIUtils');
let
    _projects = [],
    initProjects = [],
    searchProjects = [],
    projectsType = "";

const ProjectListStore = Object.assign({}, EventEmitter.prototype, {
  init : function(){
    _projects = [];
    WebAPIUtils.getCurrentUserInfo();
    this.loadProjects();
    this.emitChange();
  },

  loadProjects : function(){
    if(location.hash=="#/manager/myprojects"){
      ProjectActionCreator.getOwnProjects();
    }else{
      ProjectActionCreator.getAllProjects();
    }
  },

  setProjectsType : function(){
    if(location.hash=="#/manager/myprojects"){
      projectsType = "myProjects";
    }else{
      projectsType = "allProjects";
    }
  },

  getProjectsType : function(){
    return projectsType;
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
    this.setProjectsType();
  },

  removeProject : function( project ){
    let i;
    for( i = 0; i < _projects.length; i++ ){
      if( _projects[i].id == project.id ){
        _projects.splice(i, 1);
        this.emitChange();
        return;
      }
    }
  },

  searchProject : function( searchText ){
    let _project = null;
    const re = new RegExp(searchText, 'i');
    searchProjects = [];

    if(searchText === ""){
      _project = initProjects;
    } else {
      let i;
      for(i = 0; i < initProjects.length; i++){
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
