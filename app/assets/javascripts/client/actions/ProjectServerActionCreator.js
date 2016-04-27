//component内にはない。
//WebAPIUtils.jsが使用。サーバーからのaction.
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');

var ProjectServerActionCreator = {
  receiveProjects : function( projects ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECTS_RECEIVE,
      projects : projects
    });
  },

  receiveProject : function( project ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_RECEIVE,
      project : project
    });
  },

  createProjectSuccess : function( result ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_CREATE_SUCCESS,
      result : result,
      id : result.id,
    });
  },

  uploadAttachmentSuccess : function( result ){
    AppDispatcher.dispatch({
      type : ActionTypes.UPLOAD_ATTACHMENT_SUCCESS,
      result : result,
    });
  },

  uploadAttachmentFailed: function( result ){
    AppDispatcher.dispatch({
      type : ActionTypes.UPLOAD_ATTACHMENT_FAILED,
      result : result,
    });
  },

  updateProjectSucess : function( project ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_UPDATE_SUCCESS,
      project : project,
    });
  },

  updateProjectFailed: function( project ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_UPDATE_FAILED,
      project : project,
    });
  },

  deleteProjectSucess : function( project ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_DELETE_SUCCESS,
      project : project,
    });
  },

  deleteProjectFailed: function( project ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_DELETE_FAILED,
      project : project,
    });
  },
};

module.exports = ProjectServerActionCreator;
