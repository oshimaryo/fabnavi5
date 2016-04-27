var ViewConfig = require('../player/ViewConfig');
var QUALITY = 0.7;
function getQ (){
  return QUALITY;
};

function setQ( q ){
  QUALITY = q;
}
var ImageConverter = function(){

  function toBlob(img){
    var d = $.Deferred();
    var cvs = document.createElement('canvas');
    cvs.width = img.naturalWidth;
    cvs.height = img.naturalHeight;
    ImageConverter.drawImage(img, cvs, ViewConfig.conf());
    cvs.toBlob(function(blob){
      d.resolve(blob);
    }, "image/jpeg", QUALITY);
    return d.promise();
  }

  function projectImgToCanvas(img, cvs, conf){
    var ctx = cvs.getContext('2d'),
        /* set cropping area on image  */
        sx = Number(conf.x) || 0,
        sy = Number(conf.y) || 0,
        sw = Number(conf.w) || img.width,
        sh = Number(conf.h) || img.height,

        /* set project area */
        dx = 0,
        dy = 0,
        dw = cvs.width,
        dh = cvs.height;

    ctx.fillStyle = "black";

    if(sy < 0){
      let StoDh = dh / sh;
      dy = sy * StoDh;
      dh += dy;
      sh += sy;
      sy = 0;
      dy *= -1;
      ctx.fillRect(0, 0, cvs.width, dy);
    }

    if(sx < 0){
      let StoDw = dw / sw;
      dx = sx * StoDw;
      dw += dx;
      sw += sx;
      sx = 0;
      dx *= -1;
      ctx.fillRect(0, 0, dx, cvs.height);
    }

    if(sx + sw > img.width){
      let StoDw = dw / sw;
      sw -= sx + sw - img.width;
      dw = sw * StoDw;
      ctx.fillRect(dx + dw, 0, cvs.width - dx - dw, cvs.height);
    }

    if(sy + sh > img.height){
      let StoDh = dh / sh;
      sh -= sy + sh - img.height;
      dh = sh * StoDh;
      ctx.fillRect(0, dy + dh, cvs.width, 100);
    }
    ctx.drawImage(img, sx, sy, sw, sh, dx, dy, dw, dh);
  }

  return {
    drawImage:projectImgToCanvas,
    toBlob : toBlob,
  };
}();

global.getQ = getQ;
global.setQ = setQ;
module.exports = ImageConverter;
