const
    $ = require('jquery'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventEmitter = require('events'),
    EventTypes = require('../constants/EventTypes'),
    ActionTypes = require('../constants/ActionTypes'),
    KeyActionTypes = require('../constants/KeyActionTypes'),
    ProjectActionCreator = require('../actions/ProjectActionCreator'),
    Camera = require('../player/Camera'),
    ImageConverter = require('../player/ImageConverter'),
    CalibrateController = require('../player/CalibrateController');

let
    STEP = 1,
    _shooting = false,
    _project = null,
    _currentPage = 0,
    _uploadQueue = [
    ];


function setStep( s ){
  STEP = s;
}
function getStep( ){
  console.log(STEP);
}

const ProjectStore = Object.assign({}, EventEmitter.prototype, {
  init : function(){
    _project = null;
    _currentPage = 0;
    _uploadQueue = [];
    _shooting = false;
    Camera.init();
  },

  shoot : function(){
    console.log("shoot");
    if(_shooting){
      console.log("shooting now.");
      return;
    }
    ProjectStore.emitClearCanvas();
    Camera.shoot().then(function(url){
      const fig = ProjectStore.newFigure();
      ProjectStore.setImageToFigureFromCamera(fig, url);
      ProjectStore.pushFigure( fig );
      fig.figure.clientContent.dfdImage
        .then(ImageConverter.toBlob)
        .then(function(blob){
          let _url;

          if( url.length > 1000 ){
            _url = url.slice(30, 40) + ".jpg";
          }

          const payload = {
            file : blob,
            name : _url.replace(/\?.*/, "").replace(/^.*\//, ""),
            sym : fig.figure.sym,
          };
          ProjectActionCreator.uploadAttachment(payload);
          payload.status = "Uploading";
          ProjectStore.pushUploadQueue(payload);
        });
    });
  },

  pushUploadQueue : function( payload ){
    _uploadQueue.push({ name:payload.name, sym:payload.sym, status: payload.status });
    ProjectStore.emitChange();
  },

  uploadFinish : function( sym ){
    let i;
    for(i = 0; i < _uploadQueue.length; i++){
      if(_uploadQueue[i].sym == sym){
        _uploadQueue.splice(i, 1);
        ProjectStore.emitChange();
      }
    }
  },

  uploadFailed : function( sym ){
    let i;
    for(i = 0; i < _uploadQueue.length; i++){
      if(_uploadQueue[i].sym == sym){
        _uploadQueue[i].status = "Error";
        ProjectStore.emitChange();
      }
    }
  },

  next : function(){
    ProjectStore.setPage(_currentPage + 1);
  },

  prev : function(){
    ProjectStore.setPage(_currentPage - 1);
  },

  setPage : function(page){
    let _page = page;
    if( !_project.hasOwnProperty("content") ){
      return;
    }
    if( page >= _project.content.length ){
      _page = _project.content.length - 1;
    }

    if( _page < 0 ){
      _page = 0;
    }

    _currentPage = _page;
    console.log("_page : ", _page);
    if(_project.content[_page].figure.hasOwnProperty("_destroy") &&
      _project.content[_page].figure._destroy){
      console.log("******DELETE FLAG*********");
    }
    ProjectStore.emitChange();
  },

  setProject : function( project ){
    _project = project;
    this.emitChange();
  },

  pushFigure : function( fig ){
    _project.content.push(fig);
    ProjectStore.emitChange();
  },

  mergeUploadedFigure : function( fig ){
    const dst = ProjectStore.findFigureBySymbol( fig.sym );
    dst.figure.id = fig.id;
    dst.figure.file = fig.file;
    ProjectStore.saveProject();
    ProjectStore.uploadFinish( fig.sym );
    ProjectStore.emitChange();
  },

  saveProject : function(){
    setTimeout(function(){
      ProjectActionCreator.updateProject({
        project :  ProjectStore.getProject()
      });
    }, 0);
  },

  toggleDestroy : function(){
    if( _project.content[_currentPage].figure.hasOwnProperty("_destroy") ){
      _project.content[_currentPage].figure._destroy = !_project.content[_currentPage].figure._destroy;
    } else {
      _project.content[_currentPage].figure["_destroy"] = true;
    }
    this.emitChange();
  },

  newFigure : function( ){
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

  mergeFigureId : function( project ){
    const res = project.project;
    let i, j;
    for(i = 0; i < res.content.length; i++){
      for(j = 0; j < _project.content.length; j++){
        if(_project.content[j].figure.figure_id == null && _project.content[j].figure.id == res.content[i].figure.id ){
          _project.content[j].figure.figure_id = res.content[i].figure.figure_id;
        }
      }
    }
    ProjectActionCreator.setThumbnailLast({ project:_project });
  },

  setImageToFigureFromCamera : function( fig, url ){
    let src = null;
    if( url ){
      src = url;
      fig.figure.file.file.url = url;
    } else if( fig.figure.file.file.url ){
      src = fig.figure.file.file.url;
    } else {
      throw new Error("Figure url is not set");
    }

    const img = new Image();
    const d = $.Deferred();
    img.src = src;
    img.crossOrigin = 'anonymous';
    img.onload = function(){
      d.resolve(img);
    }
    fig.figure.clientContent.dfdImage = d.promise();
  },

  setImageToFigureFromServer : function( fig, url ){

  },

  setThumbnailToFigureFromServer : function( fig, url ){

  },


  emitChange : function(){
    _shooting = false;
    this.emit(EventTypes.PROJECT_CHANGE);
  },

  emitUpdateCanvas : function(){
    if( _project == null ){
      return;
    }
    this.emit(EventTypes.UPDATE_CANVAS_REQUEST);
  },

  emitClearCanvas : function(){
    _shooting = true;
    this.emit(EventTypes.CLEAR_CANVAS_REQUEST);
  },

  getProject : function(){
    return _project;
  },

  getCurrentPage: function(){
    return _currentPage;
  },

  getUploadQueue : function(){
    return _uploadQueue;
  },

  isShooting : function(){
    return _shooting;
  },

  addChangeListener: function(callback){
    this.on(EventTypes.PROJECT_CHANGE, callback);
  },

  addCanvasRequestListener: function(callback){
    this.on(EventTypes.UPDATE_CANVAS_REQUEST, callback);
  },

  addCanvasClearListener: function(callback){
    this.addListener(EventTypes.CLEAR_CANVAS_REQUEST, callback);
  },

  removeCanvasRequestListener: function(callback){
    this.on(EventTypes.UPDATE_CANVAS_REQUEST, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(EventTypes.PROJECT_CHANGE, callback);
  },

  removeCanvasClearListener: function(callback){
    this.removeListener(EventTypes.CLEAR_CANVAS_REQUEST, callback);
  },

  findFigureBySymbol : function( sym ){
    const cts = ProjectStore.getProject().content;
    let fig = null;
    let i;
    for(i = 0; i < cts.length; i++){
      fig = cts[i];
      if( fig.figure.hasOwnProperty('sym') && fig.figure.sym == sym ) return fig;
    }
  },
});

ProjectStore.dispatchToken = AppDispatcher.register(function( action ){
  switch(action.type){
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
      CalibrateController.moveRegionCB(0, STEP)();
      break;
    case KeyActionTypes.CALIBRATE_MOVE_UP:
      CalibrateController.moveRegionCB(0, -STEP)();
      break;

    case KeyActionTypes.PROJECT_SAVE:
      setTimeout(function(){
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
      break
    case KeyActionTypes.PROJECT_NEXT_PAGE:
      ProjectStore.next();
      break
    case KeyActionTypes.PROJECT_PREV_PAGE:
      ProjectStore.prev();
      break

    case KeyActionTypes.EXIT_PROJECT:
      location.hash = "#/manager";
      break

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
    default :
      break;
  };

});

global.ProjectStore = ProjectStore;
global.setStep = setStep;
global.getStep = getStep;
module.exports = ProjectStore;
