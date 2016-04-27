//createProject.react.jsでつかわれている。
//Player.react.js
//ProjectElement.react.js
//Projectの作成や編集など。
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var WebAPIUtils = require('../utils/WebAPIUtils');

var ProjectActionCreator = {

  getAllProjects : function( ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECTS_FETCH,
    });
    WebAPIUtils.getAllProjects();
  },

  createProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_CREATE,
      payload : payload
    });
    WebAPIUtils.createProject(payload.name, payload.contentAttributesType, payload.description);
  },

  getProject : function( payload ){
    WebAPIUtils.getProject( payload.id );
  },

  setThumbnailLast : function( payload ){
    WebAPIUtils.setThumbnailLast(payload.project);
  },

  playProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_PLAY,
      id   : payload.id
    });
  },

  updateProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_UPDATE,
      project   : payload.project
    });
    WebAPIUtils.updateProject( payload.project );
  },

  deleteProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_DELETE,
      project   : payload
    });
    WebAPIUtils.deleteProject( payload );
  },

  uploadAttachment : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.UPLOAD_ATTACHMENT,
      file   : payload.file,
      name : payload.name,
      sym : payload.sym
    });
    WebAPIUtils.uploadFile( payload.file, payload.name, payload.sym );
  },

  updateCanvas : function( ){
    AppDispatcher.dispatch({
      type : ActionTypes.UPDATE_CANVAS
    });
  },

};

module.exports = ProjectActionCreator;
