import Debug from 'debug';

import ViewConfig from '../player/ViewConfig';

const debug = Debug('fabnavi:player:CalibrateController');

export default class CalibrateController {
  constructor() {
    this.x = 0;
    this.y = 0;
    this.w = 1000;
    this.h = 1000;
    this.cx = 0;
    this.cy = 0;
    this.lx = 0;
    this.ly = 0;
    this.drag = false;
    this.zi = false;
    this.zo = false;
    this.as = 1;
    this.cvs = null;
    this.aspShift = false;
    this.isInitalized = false;
    this._isCalibrateLocked = false;
    this.getCurrentImage = null;
  }


  isCalibrationLocked() {
    return this._isCalibrateLocked;
  }

  dbg() {
    debug('x: ' + this.x);
    debug('y: ' + this.y);
    debug('w: ' + this.w);
    debug('h: ' + this.h);
    debug('cx: ' + this.cx);
    debug('cy: ' + this.cy);
    debug('lx: ' + this.lx);
    debug('ly: ' + this.ly);
  }

  zoomIn(_shift) {
    const shift = _shift | 10;
    this.w -= shift;
    this.h -= shift * this.as;
    this.validateWH();
    this.update();
  }

  zoomOut(_shift) {
    const shift = _shift | 10;
    this.w += shift;
    this.h += shift * this.as;
    this.validateWH();
    this.update();
  }

  changeAspectRatio(_shift) {
    this.w += _shift;
    this.validateWH();
    this.update();
    this.updateXYFromWH();
  }

  changeRegionCB(_w, _h) {
    return () => {
      this.w += _w;
      this.h += _h;
      this.validateWH();
      this.update();
      this.updateXYFromWH();
    }
  }

  zoomIOCB(_w, _h) {
    return () => {
      this.w = this.w * _w;
      this.h = this.h * _h;
      this.validateWH();
      this.update();
      this.updateXYFromWH();
    }
  }


  moveRegionCB(_dx, _dy) {
    return () => {
      this.moveRelatively(_dx, _dy);
    }
  }

  validateWH() {
    if(this.w < 2)this.w = 2;
    if(this.h < 2)this.h = 2;
  }

  moveRelatively(dx, dy) {
    this.cx -= dx;
    this.cy += dy;
    this.update();
  }

  loadFromViewConfig() {
    const conf = ViewConfig.conf();
    this.x = conf.x || 0;
    this.y = conf.y || 0;
    this.w = conf.w || 1000;
    this.h = conf.h || 1000;
    this.validateWH();
  }

  init ( canvas, currentImageFn ) {
    this.cvs = canvas;
    this.getCurrentImage = currentImageFn;

    setInterval(() => {
      if(this.zi)this.zoomIn();
      if(this.zo)this.zoomOut();
    }, 50);
    this.lx = this.cvs.clientWidth;
    this.ly = this.cvs.clientHeight;
    this.loadFromViewConfig();
    this.updateXYFromWH();
    this.update();
  }

  toggleAspectShiftMode() {
    this.aspShift = !this.aspShift;
  }

  addMouseEvent() {
    if(this.isCalibrationLocked()) {
      this.removeMouseEvent();
      return -1;
    }

    this.cvs.onmousedown = (e) => {
      this.drag = true;
      this.lx = e.clientX;
      this.ly = e.clientY;
    };
    this.cvs.onmouseup = () => {
      this.drag = false;
    };
    this.cvs.onmousemove = (e) => {
      if(this.drag) {
        const eX = e.clientX;
        if(this.aspShift) {
          this.changeAspectRatio(this.lx - eX);
          this.lx = eX;
        } else {
          const eY = e.clientY;
          this.moveRelatively(this.lx - eX, eY - this.ly);
          this.lx = eX;
          this.ly = eY;
        }
      }
    };
  }

  removeMouseEvent() {
    this.cvs.onwheel = '';
    this.cvs.onmousedown = '';
    this.cvs.onmouseup = '';
    this.cvs.onmousemove = '';
  }

  updateXYFromWH() {
    this.as = this.h / this.w;
    this.cx = Math.floor(this.w / 2) + Number(this.x);
    this.cy = Math.floor(this.h / 2) + Number(this.y);
  }

  updateXYFromCenter () {
    this.x = this.cx - Math.floor(this.w / 2);
    this.y = this.cy - Math.floor(this.h / 2);
  }

  update() {
    this.updateXYFromCenter();
    if(this.isInitalized ) {
      ViewConfig.setConf({ x:this.x, y:this.y, w:this.w, h:this.h });
      //XXX
      ViewConfig.save();
    } else {
      this.initConf();
    }
  }

  initConf() {
    const conf = ViewConfig.conf();
    if( conf.hasOwnProperty('w')) {
      this.w = conf.w;
      this.h = conf.h;
      this.x = conf.x;
      this.y = conf.y;
      this.validateWH();
      this.updateXYFromWH();
      this.updateXYFromCenter();
      this.isInitalized = true;
      return;
    }

    if(this.getCurrentImage()) {
      const img = this.getCurrentImage();
      this.w = img.naturalWidth;
      this.h = img.naturalHeight;
      this.validateWH();
      this.updateXYFromWH();
      this.updateXYFromCenter();
      this.isInitalized = true;
    }
  }

}
