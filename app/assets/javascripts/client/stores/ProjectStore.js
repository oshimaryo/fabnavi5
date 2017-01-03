import Debug from 'debug';

const
    debug = Debug("fabnavi:store:project"),
    $ = require('jquery'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events'),
    EventTypes = require('../constants/EventTypes'),
    ActionTypes = require('../constants/ActionTypes'),
    KeyActionTypes = require('../constants/KeyActionTypes'),
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    ImageConverter = require('../player/ImageConverter'),
    CalibrateController = require('../player/CalibrateController');

let
    STEP = 10,
    _shooting = false,
    _project = null,
    _name = null,
    _description = null,
    _private = null,
    _delContent = [],
    _currentPage = 0,
    _uploadQueue = [],
    _currentTime = 0,
    _isPlaying = true
    ;


function setStep( s ) {
  STEP = s;
}
function getStep( ) {
  debug(STEP);
}

const ProjectStore = Object.assign({}, EventEmitter.prototype, {
  init : function() {
    _project = null;
    _currentPage = 0;
    _uploadQueue = [];
    _shooting = false;
  },

  pushUploadQueue : function( payload ) {
    _uploadQueue.push({ name:payload.name, sym:payload.sym, status: payload.status });
    ProjectStore.emitChange();
  },

  uploadFinish : function( sym ) {
    let i;
    for(i = 0; i < _uploadQueue.length; i++) {
      if(_uploadQueue[i].sym == sym) {
        _uploadQueue.splice(i, 1);
        ProjectStore.emitChange();
      }
    }
  },

  uploadFailed : function( sym ) {
    let i;
    for(i = 0; i < _uploadQueue.length; i++) {
      if(_uploadQueue[i].sym == sym) {
        _uploadQueue[i].status = "Error";
        ProjectStore.emitChange();
      }
    }
  },

  next : function() {
    ProjectStore.setPage(_currentPage + 1);
  },

  prev : function() {
    ProjectStore.setPage(_currentPage - 1);
  },

  togglePlayPause : function() {
    _isPlaying = !_isPlaying;
    ProjectStore.emitChange();
  },

  setPage : function(page) {
    let _page = page;
    _currentPage = _page;
    if( !_project.hasOwnProperty("content") ) {
      return;
    }
    if( page >= _project.content.length ) {
      _page = _project.content.length - 1;
    }

    if( _page < 0 ) {
      _page = 0;
    }
    _currentPage = _page;


    debug("_page : ", _page);
    if(_project.content[_page].figure.hasOwnProperty("_destroy") &&
      _project.content[_page].figure._destroy) {
      debug("******DELETE FLAG*********");
    }
    ProjectStore.emitChange();
  },

  setProject : function( project ) {
    _project = project;
    if( _project.content.length > 0 && _project.content[0].type === "Figure::Frame" ) {
      _project["type"] = "movie";
    } else {
      _project["type"] = "photo";
    }
    this.emitChange();
  },

  pushFigure : function( fig ) {
    _project.content.push(fig);
    ProjectStore.emitChange();
  },

  mergeUploadedFigure : function( fig ) {
    const dst = ProjectStore.findFigureBySymbol( fig.sym );
    dst.figure.id = fig.id;
    dst.figure.file = fig.file;
    ProjectStore.saveProject();
    ProjectStore.uploadFinish( fig.sym );
    ProjectStore.emitChange();
  },

  saveProject : function() {
    setTimeout(function() {
      ProjectActionCreator.updateProject({
        project :  ProjectStore.getProject()
      });
    }, 0);
  },

  toggleDestroy : function() {
    if( _project.content[_currentPage].figure.hasOwnProperty("_destroy") ) {
      _project.content[_currentPage].figure._destroy = !_project.content[_currentPage].figure._destroy;
    } else {
      _project.content[_currentPage].figure["_destroy"] = true;
    }
    this.emitChange();
  },

  toggleDestroyContent:function() {
    debug("toggletoggle");
    debug(_project.content.length);
    debug(_delContent.length);
    for(let i = 0; i < _project.content.length; i++) {
      for(let j = 0; j < _delContent.length; j++) {
        if(_project.content[i].figure.figure_id == _delContent[j]) {
          debug(_project.content[i].figure.file.file.thumb.url);
          _project.content[i].figure["_destroy"] = true;
          debug(_project.content[i].figure["_destroy"]);
        }
      }
    }
    ProjectStore.emitChange();
  },

  changeTitle:function() {
    _project.name = _name;
    _project.description = _description;
    _project.private = _private;
    _project._edited = true;
    ProjectStore.emitChange();
  },

  backToHome:function() {
    if(location.hash.includes("#/manager/detail")) {
      location.hash = "#/manager";
    } else if(location.hash.includes("#/manager/edit")) {
      location.hash = "#/mamager/myprojects";
    } else {
      location.hash = "#/manager";
    }
  },


  newFigure : function( ) {
    return {
      figure : {
        sym           : gensym(),
        figure_id     : null,
        clientContent : {
          dfdImage      : null,
          dfdThumbnail  : null,
        },
        serverContent : {
          dfdImage      : null,
          dfdThumbnail  : null,
        },
        file : {
          id : null,
          file : {
            url : null,
            thumb : {
              url : null
            },
          },
        },
        position : 7,
      }
    };
  },

  mergeFigureId : function( project ) {
    const res = project.project;
    let i, j;
    for(i = 0; i < res.content.length; i++) {
      for(j = 0; j < _project.content.length; j++) {
        if(_project.content[j].figure.figure_id == null && _project.content[j].figure.id == res.content[i].figure.id ) {
          _project.content[j].figure.figure_id = res.content[i].figure.figure_id;
        }
      }
    }
    ProjectActionCreator.setThumbnailLast({ project:_project });
  },

  setImageToFigureFromCamera : function( fig, url ) {
    let src = null;
    if( url ) {
      src = url;
      fig.figure.file.file.url = url;
    } else if( fig.figure.file.file.url ) {
      src = fig.figure.file.file.url;
    } else {
      throw new Error("Figure url is not set");
    }

    const img = new Image();
    const d = $.Deferred();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = function() {
      d.resolve(img);
    }
    fig.figure.clientContent.dfdImage = d.promise();
  },

  setImageToFigureFromServer : function( fig, url ) {

  },

  setThumbnailToFigureFromServer : function( fig, url ) {

  },


  emitChange : function() {
    _shooting = false;
    this.emit(EventTypes.PROJECT_CHANGE);
  },

  emitUpdateCanvas : function() {
    if( _project == null ) {
      return;
    }
    this.emit(EventTypes.UPDATE_CANVAS_REQUEST);
  },

  emitClearCanvas : function() {
    _shooting = true;
    this.emit(EventTypes.CLEAR_CANVAS_REQUEST);
  },

  getProject : function() {
    return _project;
  },

  getCurrentPage: function() {
    return _currentPage;
  },

  getUploadQueue : function() {
    return _uploadQueue;
  },

  isShooting : function() {
    return _shooting;
  },

  isPlaying : function() {
    return _isPlaying;
  },

  addChangeListener: function(callback) {
    this.on(EventTypes.PROJECT_CHANGE, callback);
  },

  addCanvasRequestListener: function(callback) {
    this.on(EventTypes.UPDATE_CANVAS_REQUEST, callback);
  },

  addCanvasClearListener: function(callback) {
    this.addListener(EventTypes.CLEAR_CANVAS_REQUEST, callback);
  },

  removeCanvasRequestListener: function(callback) {
    this.on(EventTypes.UPDATE_CANVAS_REQUEST, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.PROJECT_CHANGE, callback);
  },

  removeCanvasClearListener: function(callback) {
    this.removeListener(EventTypes.CLEAR_CANVAS_REQUEST, callback);
  },

  findFigureBySymbol : function( sym ) {
    const cts = ProjectStore.getProject().content;
    let fig = null;
    let i;
    for(i = 0; i < cts.length; i++) {
      fig = cts[i];
      if( fig.figure.hasOwnProperty('sym') && fig.figure.sym == sym ) return fig;
    }
  },
});

ProjectStore.dispatchToken = AppDispatcher.register(function( action ) {
  switch(action.type) {
    case KeyActionTypes.CALIBRATE_LONGER_HORIZONTAL:
      CalibrateController.changeRegionCB(-STEP, 0)();
      break;
    case KeyActionTypes.CALIBRATE_SHORTER_HORIZONTAL:
      CalibrateController.changeRegionCB(STEP, 0)();
      break;
    case KeyActionTypes.CALIBRATE_LONGER_VERTICAL:
      CalibrateController.changeRegionCB(0, STEP)();
      break;
    case KeyActionTypes.CALIBRATE_SHORTER_VERTICAL:
      CalibrateController.changeRegionCB(0, -STEP)();
      break;

    case KeyActionTypes.CALIBRATE_MOVE_RIGHT:
      CalibrateController.moveRegionCB(STEP, 0)();
      break;
    case KeyActionTypes.CALIBRATE_MOVE_LEFT:
      CalibrateController.moveRegionCB(-STEP, 0)();
      break;
    case KeyActionTypes.CALIBRATE_MOVE_DOWN:
      CalibrateController.moveRegionCB(0, -STEP)();
      break;
    case KeyActionTypes.CALIBRATE_MOVE_UP:
      CalibrateController.moveRegionCB(0, STEP)();
      break;

    case KeyActionTypes.PROJECT_SAVE:
      setTimeout(function() {
        ProjectActionCreator.updateProject({
          project:ProjectStore.getProject()
        });
      }, 0);
      break;
    case KeyActionTypes.TOGGLE_DELETE_FLAG :
      ProjectStore.toggleDestroy();
      break;
    case KeyActionTypes.PROJECT_SHOOT:
      ProjectStore.shoot();
      break;
    case KeyActionTypes.PROJECT_NEXT_PAGE:
      ProjectStore.next();
      break;
    case KeyActionTypes.PROJECT_PREV_PAGE:
      ProjectStore.prev();
      break;
    case KeyActionTypes.PROJECT_PLAY_PAUSE:
      ProjectStore.togglePlayPause();
      break;

    case KeyActionTypes.CALIBRATE_ZOOMOUT:
      CalibrateController.zoomIOCB(1.01, 1.01)();
      break;
    case KeyActionTypes.CALIBRATE_ZOOMIN:
      CalibrateController.zoomIOCB(0.99, 0.99)();
      break;

    case KeyActionTypes.EXIT_PROJECT:
      location.hash = "#/manager";
      break;

    case ActionTypes.PROJECT_RECEIVE:
      ProjectStore.setProject( action.project );
      break;
    case ActionTypes.UPDATE_CANVAS :
      ProjectStore.emitUpdateCanvas();
      break;

    case ActionTypes.PROJECT_CREATE_SUCCESS:
    case ActionTypes.PROJECT_PLAY:
      location.hash = "#/project/play/" + action.id;
      ProjectStore.init();
      break;
    case ActionTypes.UPLOAD_ATTACHMENT_SUCCESS :
      ProjectStore.mergeUploadedFigure( action.result );
      ProjectStore.findFigureBySymbol(action.result.sym);
      break;
    case ActionTypes.PROJECT_UPDATE_SUCCESS:
      ProjectStore.mergeFigureId( action.project);
      break;
    case ActionTypes.PROJECT_UPDATE_FAILED:
      break;
    case ActionTypes.UPLOAD_ATTACHMENT_FAILED:
      ProjectStore.uploadFailed( action.result.sym );
      break;
    case ActionTypes.PROJECT_DETAIL:
      debug("PROJECT_DETAIL");
      location.hash = "#/manager/detail/" + action.id;
      break;
    case ActionTypes.PROJECT_EDIT:
      location.hash = "#/manager/edit/" + action.id;
      break;
    case ActionTypes.EDIT_CONTENT:
      _project = action.project;
      _delContent = action.content_array;
      debug(_project);
      debug(_delContent);
      ProjectStore.toggleDestroyContent();
      setTimeout(function() {
        ProjectActionCreator.updateProject({
          project:ProjectStore.getProject()
        });
      }, 0);
      setTimeout(function() {
        location.hash = "#/manager/myprojects";
      }, 0);
      break;
    case ActionTypes.EDIT_TITLE:
      _project = action.project;
      _name = action.name;
      _description = action.description;
      _private = action.private;
      debug("ProjectStore: " + _name);
      ProjectStore.changeTitle();
      setTimeout(function() {
        ProjectActionCreator.updateProject({
          project:ProjectStore.getProject()
        });
      }, 0);
      setTimeout(function() {
        location.hash = "#/manager/myprojects";
      }, 0);

      break;
    default :
      break;
  };

});

global.ProjectStore = ProjectStore;
global.setStep = setStep;
global.getStep = getStep;
module.exports = ProjectStore;
