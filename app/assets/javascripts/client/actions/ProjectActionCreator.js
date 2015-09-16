var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var WebAPIUtils = require('../utils/WebAPIUtils');

var ProjectActionCreator = {
  getAllProjects : function( ){
    AppDispatcher.dispatch ({
      type : ActionTypes.PROJECT_FETCH,
    });
    
    WebAPIUtils.getAllProjects();
  }, 

  createProject : function( payload ){
    AppDispatcher.dispatch({
      type : ActionTypes.PROJECT_CREATE
    });
    WebAPIUtils.createProject( payload.name, payload.contentAttributesType );
  },


};

module.exports = ProjectActionCreator;
