import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';

import MainView from '../player/MainView';
import ViewConfig from '../player/ViewConfig';
import Action from '../actions/ProjectActionCreator';

import { Route, RouteHandler, Link, DefaultRoute } from 'react-router';

import Debug from 'debug';

const debug = Debug('fabnavi:jsx:Player');

let
    _currentImage = null,
    lastPage = 0,
    _lastState = '',
    _currentState = '';

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
    this.clearCanvas = () => {
      MainView.clear();
    };
    this.updateCanvas = this.updateCanvas.bind(this);
    this.video = document.createElement('video');
    this.renderingTimer = null;
  }

  updateCanvas() {
    const project = this.props.project;
    const isValidProject = () => {
      return typeof project === 'object' && project.content.length !== 0;
    };
    if(!isValidProject()) {
      debug('invalid project data', project);
      return;
    }

    if( this.props.contentType === 'movie') {
      if(this.video.src === '') {
        this.video.width = window.screen.width;
        this.video.height = window.screen.height;
        this.video.src = project.content[0].figure.file.file.url;
      }
      if(this.props.playing) {
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

    _currentState = this.props.mode;
    if( _currentState != _lastState ) {
      MainView.clear();
    }
    _lastState = _currentState;

    const getCurrentImage = () => {
      return new Promise((resolve, reject) => {
        if( lastPage === this.props.page && _currentImage != null ) {
          debug('there is no change.');
          resolve(_currentImage);
          return;
        }

        const fig = this.props.project.content[this.props.page].figure;
        lastPage = this.props.page;
        if(fig.hasOwnProperty('clientContent') && fig.clientContent.hasOwnProperty('dfdImage')) {
          debug('page changed.');
          fig.clientContent.dfdImage
          .then(img => {
            resolve(img, true);
          })
          .catch(reject);
          return;
        }

        debug('page changed, but image is not loaded yet.')

        const img = new Image();
        MainView.redraw();
        MainView.showWaitMessage();
        if(lastPage === 0) {
          MainView.showInstructionMessage();
        }
        img.src = fig.file.file.url;
        img.onload = (event) => {
          resolve(event.target);
        }
        img.onerror = reject;
      });
    };

    getCurrentImage()
    .then((img, crop) => {
      debug('got current image');
      _currentImage = img;
      if(crop) {
        ViewConfig.setCropped(true);
        MainView.clear();
      }
      MainView.draw(_currentImage);

      if(lastPage === 0) {
        MainView.showInstructionMessage();
      }

      switch(_currentState) {
        case'calibrateCenter':
          MainView.showCalibrateCenterLine();
          MainView.showCenterInstruction();
          break;
        case'calibrateScale':
          MainView.showCalibrateScaleLine();
          MainView.showScaleInstruction();
          break;
        default:
          break;
      }
    })
    .catch(e => {
      debug('failed to load Image', e);
    });
  }


  componentWillMount() {
    if(!this.props.project) {
      debug('project not loaded!');
      setTimeout( () => {
        Action.getProject({ id: location.pathname.split('/')[2] });
      }, 1000);
    }
  }

  componentDidMount() {
    MainView.init( ReactDOM.findDOMNode(this.refs.mainCanvas));
  }

  componentDidUpdate() {
    this.updateCanvas();
  }
}

function mapStateToProps(state) {
  debug('mapping: ', state.player);
  return state.player
}

export default connect(mapStateToProps)(Player);
