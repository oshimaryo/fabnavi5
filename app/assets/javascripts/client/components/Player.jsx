import React, {Component, PropsTypes} from 'react';
import ReactDOM, {findDOMNode} from 'react-dom';
import { connect } from 'react-redux';
import Debug from 'debug';

import MainView from '../player/MainView';

const debug = Debug('fabnavi:jsx:Player');


class Player extends Component {

  constructor(props) {
    super(props);

    console.log('Player.jsx');
    console.dir(this.props);

    this.clearCanvas = () => {
      this.canvas.clear();
    };
    this.canvas = null;
    this.currentImage = null,
      this.lastPage = 0,
      this.lastState = '',
      this.currentState = '';

    this.updateCanvas = this.updateCanvas.bind(this);// これをやらないとundefinedになる
    this.video = document.createElement('video');// 
    this.renderingTimer = null;// 
  }

  // Player Componentがrenderingするもの
  render() {
    // refはコンポーネントを識別するための属性
    // 同一Component内（Player内）のrefは全てrefsというのにまとめられる
    // this.ref.mainCanvas：これでPlayer Componentにアクセスできるようになる
    // このPlayerのDOM要素を角六する場合に，ReactDOM.findDOMNodeを使用
    return (
      <div>
        <canvas ref="mainCanvas" />
      </div>
    );
  }
  
  // updateCanvas function
  updateCanvas() {
    // console.log('--- Props in Player.jsx ---');
    // console.dir(this.props);
    const project = this.props.project;
    console.log('update canvas function type is ' + typeof project);
    console.dir(this.props);
    // console.log('--- updateCanvas function project ---');
    // console.dir(project);
    // console.log('content length is ' + project.content.length);// 長さ確認
    // return true ro false, isValidProject
    const isValidProject = () => {
      // console.log('- isValidProject is actioned -');
      // TODO:  Cannot read property 'content' of null
      // content propertyがない => projectが読み込まれていない
      // console.log('return object : ' + (typeof project === 'object' && project.data.content.length !== 0));
      return typeof project === 'object' && project.data.content.length !== 0;
    };

    // もしfalseの場合 => 画像がない場合
    if (!isValidProject()) {
      debug('invalid project data', project);
      // console.log('this project is no Images. So this function is stopped');
      // return null;これじゃまずい気がする
      return;
    }

    // content typeがmovieの場合 => 今回はないので無視
    console.log(this.props.contentType);
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

    // currentStateをprops内のmodeにする（多分 mode: play）
    // this.currentState = this.props.mode;
    console.log('prev currentState');
    this.currentState = 'play';
    console.log('after currentState');
    // currentStateがlastStateじゃなければ
    // つまり初回は 'play' と ''なので，trueとなる
    // != を !== に変更した
    // 現在の状態と，最後の状態を比較？
    if (this.currentState !== this.lastState) {
      this.canvas.clear();// canvasをクリア
    }

    // lastStateをcurrentStateにする
    // play?
    this.lastState = this.currentState;

    // getCurrentImage function 
    // promise形式だからチェーンメソッド
    console.log('define getCurrentImage function');
    const getCurrentImage = () => {
      return new Promise((resolve, reject) => {
        // lastPage（最初は0）がpropsで渡されたpageかつ，currentImageが存在する場合
        // 
        if (this.lastPage === this.props.page && this.currentImage != null) {
          // resolveなので，処理が成功した状態
          // this.currentImageをreturn 
          resolve(this.currentImage);
          // 成功処理なのにnullを返すの ... ? 
          // 一回消す
          // return;
        }

        // figは，props.projectの中のcontent配列のpage番目のfigureが入る
        const fig = this.props.project.data.content[this.props.page].figure;
        console.log('fig in getCurrentImage function is ');
        console.dir(fig);

        // 最後のページをpropsのpageに指定する．多分総合ページ数？
        this.lastPage = this.props.page;

        // figの中にclientContentがあるかつ，clientContentの中に，dfdImageがある場合
        if (fig.hasOwnProperty('clientContent') && fig.clientContent.hasOwnProperty('dfdImage')) {
          // わからん
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
        console.log('getCurrentImage was called');
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
