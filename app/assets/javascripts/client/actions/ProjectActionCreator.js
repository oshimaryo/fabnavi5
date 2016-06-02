//createProject.react.jsでつかわれている。
//Player.react.js
//ProjectElement.react.js
//Projectの作成や編集など。
const
    ActionTypes = require('../constants/ActionTypes'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    WebAPIUtils = require('../utils/WebAPIUtils');

const ProjectActionCreator = {

  getAllProjects : function( ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECTS_FETCH,
    });
    WebAPIUtils.getAllProjects();
  },

  getOwnProjects : function(){
    const uid = WebAPIUtils.loadCurrentUserInfo();

    AppDispatcher.dispatch({
      type : ActionTypes.PROJECTS_FETCH,
    });
    WebAPIUtils.getOwnProjects(uid);
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

  editProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_EDIT,
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

  editContent : function( project,content_array ){
    AppDispatcher.dispatch({
      type : ActionTypes.EDIT_CONTENT,
      project : project,
      content_array : content_array
    });
  },
  editTitle : function( project,name,description ){
    AppDispatcher.dispatch({
      type : ActionTypes.EDIT_TITLE,
      project : project,
      name : name,
      description : description
    });
  },

  detailProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_DETAIL,　
      id   : payload.id
    });
  },

};

module.exports = ProjectActionCreator;
