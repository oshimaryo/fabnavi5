import React, {Component, PropsTypes} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import Debug from 'debug';

import MainView from '../player/MainView';

const debug = Debug('fabnavi:jsx:Player');


class Player extends Component {

  constructor(props) {
    super(props);
    // console.log('---- Constructor of Player.jsx is called ----');
    // console.dir(this.props);
    this.clearCanvas = () => {
      this.canvas.clear();
    };
    this.canvas = null;
    this.currentImage = null,
      this.lastPage = 0,
      this.lastState = '',
      this.currentState = '';

    this.updateCanvas = this.updateCanvas.bind(this);
    this.video = document.createElement('video');
    this.renderingTimer = null;
  }

  render() {
    // console.log('---- Player Component render function is called ----');
    return (
      <div>
        <canvas ref="mainCanvas" />
      </div>
    );
  }
  
  updateCanvas() {
    // console.log('---- updateCanvas function is called ----');
    // console.log('--- props data is below ---');
    // console.dir(this.props);
    const project = this.props.project;
    // console.log('-- project contents is below --');
    // console.dir('project ' + project);
    
    const isValidProject = () => {
      // console.log('--- isValidProjectn() is called ---');
      // console.dir(project.data);
      // TODO:  Cannot read property 'content' of null
      // content propertyがない => projectが読み込まれていない
      return typeof project === 'object' && project.data.content.length !== 0;
    };

    // もしfalseの場合 => 画像がない場合
    if (!isValidProject()) {
      debug('invalid project data', project);
      // console.error('this project is no Images. So this function is stopped');
      return;
    }

    // content typeがmovieの場合 => 今回はないので無視
    if (this.props.contentType === 'movie') {
      if (this.video.src === '') {
        this.video.width = window.screen.width;
        this.video.height = window.screen.height;
        this.video.src = project.content[0].figure.file.file.url;
      }
      if (this.props.isPlaying) {
        this.renderingTimer = setInterval(() => {
          this.canvas.render(this.video);
        }, 30);
        this.video.play();
      } else {
        clearInterval(this.renderingTimer);
        this.video.pause();
      }
      return;
    }

    // console.log('-- prev this.currentState --');
    this.currentState = this.props.mode;
    // this.currentState = 'play';
    // console.log('this.currentState is ' + this.currentState);
    // console.log('-- after this.currentState --');

    if (this.currentState !== this.lastState) {
      // console.log('- canvas clear -');
      this.canvas.clear();// canvasをクリア
    }

    // console.log('-- prev this.lastState --');
    this.lastState = this.currentState;
    // console.log('this.lastState is ' + this.lastState);
    // console.log('-- after this.lastState --');

    // console.log('define getCurrentImage function');
    const getCurrentImage = () => {
      return new Promise((resolve, reject) => {
        if (this.lastPage === this.props.page && this.currentImage != null) {
          // console.log('--- resolve in Promise is called ---');
          resolve(this.currentImage);
          // return;
        }

        const fig = this.props.project.data.content[this.props.page].figure;
        // console.log('--- fig in getCurrentImage function is ---');
        // console.log('-- tmp props --');
        // console.dir(this.props);
        // console.dir(fig);

        // console.log('--- prev this.lastPage ---');
        this.lastPage = this.props.page;
        // console.log(this.lastPage);
        // console.log('--- after this.lastPate ---');

        if (fig.hasOwnProperty('clientContent') && fig.clientContent.hasOwnProperty('dfdImage')) {
          fig.clientContent.dfdImage
            .then(img => {
              resolve(img, true);
            })
            .catch(reject);
          return;
        }

        // imgを生成する
        const img = new Image();
        // canvasをredraw
        this.canvas.redraw();
        // MainViewの中にある関数の描画
        this.canvas.drawWaitingMessage();

        // lastPageが0，つまりない場合
        if (this.lastPage === 0) {
          this.canvas.drawInstructionMessage();
        }
        img.src = fig.file.file.url;
        img.onload = (event) => {
          resolve(event.target);
        }
        img.onerror = reject;
      });
    };

    getCurrentImage()
      .then(img => {
        // console.log('--- getCurrentImage was called ---');
        this.currentImage = img;
        this.canvas.draw(this.currentImage, this.props.config);

        if (this.lastPage === 0) {
          this.canvas.drawInstructionMessage();
        }

        switch (this.currentState) {
          case 'calibrateCenter':
            this.canvas.drawCalibrateCenterLine();
            this.canvas.drawCenterInstruction();
            break;
          case 'calibrateScale':
            this.canvas.drawCalibrateScaleLine();
            this.canvas.drawScaleInstruction();
            break;
          default:
            break;
        }
      })
      .catch(e => {
        console.error(e);
        debug('failed to load Image', e);
      });
  }

  componentWillMount() {
    if (!this.props.project) {
      debug('project not loaded!');
      api.getProject(location.pathname.split('/')[2]);
    }
  }

  componentDidMount() {
    this.canvas = new MainView(findDOMNode(this.refs.mainCanvas));
  }

  componentDidUpdate() {
    this.updateCanvas();
  }
}

function mapStateToProps(state) {
  return state.player
}

export default connect(mapStateToProps)(Player);
