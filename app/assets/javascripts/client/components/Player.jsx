import React from 'react';
import ReactDOM from 'react-dom';

import ProjectStore from '../stores/ProjectStore';
import MainView from '../player/MainView';
import ViewConfig from '../player/ViewConfig';
import ProjectActionCreator from '../actions/ProjectActionCreator';

import { Route, RouteHandler, Link, DefaultRoute } from 'react-router';

import CalibrateController from '../player/CalibrateController';
import WebAPIUtils from '../utils/WebAPIUtils';
import State from '../utils/FabnaviStateMachine';
import Debug from 'debug';

const debug = Debug("fabnavi:jsx:Player");
let
    currentFile = null,
    _currentImage = null,
    pageChanged = true,
    lastPage = 0,
    _lastPage = 0,
    _lastState = "",
    _currentState = "";

class Player extends React.Component {

  render() {
    return (
      <div>
        <canvas ref="mainCanvas" />
      </div>
    );
  }

  constructor(props) {
    super(props);
    this._onChange = this._onChange.bind(this);
    this._onCanvasUpdate = this._onCanvasUpdate.bind(this);
    this._onCanvasClear = this._onCanvasClear.bind(this);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFile = this.handleFile.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.updateCanvas = this.updateCanvas.bind(this);
    this.reset = this.reset.bind(this);
    this.getStateFromStores = this.getStateFromStores.bind(this);
    this.state = this.getStateFromStores();
    this.props = {};
    this.video = document.createElement("video");
    this.renderingTimer = null;
  }

  reset() {
    currentFile = null;
    _currentImage = null;
    pageChanged = true;
    lastPage = 0;
    _lastState = "";
    _currentState = "";
    MainView.reset();
  }

  getStateFromStores() {
    const project = ProjectStore.getProject();
    if( project == null || this.props.params.projectId != project.id ) {
      return {
        project : null,
        page : 0,
        uploadQueue : [],
        shooting : false,
      };
    }

    return {
      project : project,
      page : ProjectStore.getCurrentPage(),
      uploadQueue : ProjectStore.getUploadQueue(),
      shooting : ProjectStore.isShooting(),
      playing : ProjectStore.isPlaying()
    };
  }

  _onChange() {
    this.setState(this.getStateFromStores());
  }

  _onCanvasUpdate() {
    this.updateCanvas();
  }

  _onCanvasClear() {
    this.clearCanvas();
  }

  handleSubmit( event ) {
    if( currentFile == null ) return;
    WebAPIUtils.uploadFile( currentFile );
  }

  handleFile( event ) {
    currentFile = event.target.files[0];
  }

  updateCanvas() {

    if(this.state.project == null) {
      return 0;
    }

    if( this.state.project.content.length == 0) {
      return 0;
    }

    if( this.state.project.type === "movie") {
      if(this.video.src === "") {
        this.video.width = window.screen.width;
        this.video.height = window.screen.height;
        this.video.src = this.state.project.content[0].figure.file.file.url;
      }
      if(this.state.playing) {
        this.renderingTimer = setInterval(() => {
          MainView.render(this.video);
        }, 30);
        this.video.play();
      } else {
        clearInterval(this.renderingTimer);
        this.video.pause();
      }
      debug(this.video.currentTime);
      return;
    }

    _currentState = State.compositeState();
    if( _currentState != _lastState ) {
      MainView.clear();
    }
    _lastState = _currentState;

    if( lastPage == this.state.page && _currentImage != null ) {
      MainView.draw(_currentImage);
      if(lastPage <= 0) {
        MainView.showInstructionMessage();
      }
      if( _currentState.includes("calibrateCenter") ) {
        MainView.showCalibrateCenterLine();
        MainView.showCenterInstruction();
      } else if(_currentState.includes("calibrateScale") ) {
        MainView.showCalibrateScaleLine();
        MainView.showScaleInstruction();
      }
      return 0;
    }

    const fig = this.state.project.content[this.state.page].figure;
    lastPage = this.state.page;
    if(fig.hasOwnProperty("clientContent") && fig.clientContent.hasOwnProperty("dfdImage")) {
      fig.clientContent.dfdImage.then(function(img) {
        ViewConfig.setCropped(true);
        MainView.clear();
        MainView.draw(img);
        _currentImage = img;
      });
    } else {
      const img = new Image();
      ViewConfig.setCropped(false);
      MainView.redraw();
      MainView.showWaitMessage();
      if(lastPage <= 0) {
        MainView.showInstructionMessage();
      }
      img.src = fig.file.file.url;
      img.onload = function(aImg) {
        MainView.clear();
        MainView.draw(img);
        if(lastPage <= 0) {
          MainView.showInstructionMessage();
        }
        _currentImage = img;
        if( _currentState.includes("calibrateCenter") ) {
          MainView.showCalibrateCenterLine();
          MainView.showCenterInstruction();
        } else if(_currentState.includes("calibrateScale") ) {
          MainView.showCalibrateScaleLine();
          MainView.showScaleInstruction();
        }
      }
      img.onerror = function(err) {
        debug("Image load error : ", err, img);
        throw new Error(err);
      }
    }
    if( _currentState.includes("calibrateCenter") ) {
      MainView.showCalibrateCenterLine();
      MainView.showCenterInstruction();
    } else if(_currentState.includes("calibrateScale") ) {
      MainView.showCalibrateScaleLine();
      MainView.showScaleInstruction();
    }
  }

  clearCanvas() {
    MainView.clear();
  }

  componentWillMount() {
    debug(this.props);
    ProjectActionCreator.getProject({ id:this.props.params.projectId });
  }

  componentDidMount() {
    MainView.init( ReactDOM.findDOMNode(this.refs.mainCanvas));
    ProjectStore.addChangeListener(this._onChange);
    ProjectStore.addCanvasRequestListener(this._onCanvasUpdate);
    ProjectStore.addCanvasClearListener(this._onCanvasClear);
    State.transition("player");
  }

  componentWillUpdate() {
    return {
    };
  }

  componentDidUpdate() {
    this.updateCanvas();
  }

  componentWillUnmount() {
    ProjectStore.init();
    ProjectStore.emitChange();
    this.reset();
    ProjectStore.removeChangeListener(this._onChange);
    ProjectStore.removeCanvasRequestListener(this._onCanvasUpdate);
    ProjectStore.removeCanvasClearListener(this._onCanvasClear);
  }

}

export default Player;
