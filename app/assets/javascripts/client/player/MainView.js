const ImageConverter = require('../player/ImageConverter');
const ViewConfig = require('../player/ViewConfig');
const CalibrateController = require('../player/CalibrateController');

const MainView = function(){
  let cvs,
      ctx,
      currentImage = null;

  function reset(){
    if(ctx != null)clear();
    currentImage = null;
    ctx = null;
    cvs = null;
  }

  function init (canvasElement){
    reset();
    initCanvas(canvasElement);

    CalibrateController.init( canvasElement, getCurrentImage );
    ViewConfig.init();
    clear();
  }

  function getCtx(){
    return ctx;
  }

  function getCvs(){
    return cvs;
  }

  function initCanvas(canvasElement){
    cvs = canvasElement;
    ctx = cvs.getContext('2d');
    cvs.width = screen.width;
    cvs.height = screen.height;
    ctx.strokeStyle = "#00ff00";
  }

  function drawCalibrateLine(){
    ctx.strokeStyle = "#539ECD";
    ctx.beginPath();
    ctx.lineWidth = 3.0;
    ctx.moveTo(0, cvs.height / 2);
    ctx.lineTo(cvs.width, cvs.height / 2);
    ctx.moveTo(cvs.width / 2, 0);
    ctx.lineTo(cvs.width / 2, cvs.height);
    ctx.stroke();
  }

  function drawWaitingMessage(){
    ctx.font = "100px NotoSans-Regular, sans-serif";
    ctx.textBaseline = 'top';
    ctx.lineWidth = 5.0;
    ctx.strokeStyle = "#343434";
    ctx.strokeText("Now Loading...", cvs.width/2-300,cvs.height/2);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("Now Loading...", cvs.width/2-300,cvs.height/2);
  }

  function drawInstructionMessage(){
    ctx.font = "40px NotoSans-Regular, sans-serif";
    ctx.textBaseline = 'top';
    ctx.lineWidth = 5.0;
    ctx.strokeStyle = "#343434";
    ctx.strokeText(" c : Calibration Mode", cvs.width/8,cvs.height/8);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(" c : Calibration Mode", cvs.width/8,cvs.height/8);
    ctx.strokeStyle = "#343434";
    ctx.strokeText(" ↑  : Zoom In", cvs.width/8,cvs.height/8+70);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(" ↑  : Zoom In", cvs.width/8,cvs.height/8+70);
    ctx.strokeStyle = "#343434";
    ctx.strokeText(" ↓  : Zoom Out", cvs.width/8,cvs.height/8+140);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(" ↓  : Zoom Out", cvs.width/8,cvs.height/8+140);
    ctx.strokeStyle = "#343434";
    ctx.strokeText("← : To Privious Page", cvs.width/8,cvs.height/8+210);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("← : To Privious Page", cvs.width/8,cvs.height/8+210);
    ctx.strokeStyle = "#343434";
    ctx.strokeText("→ : To Next Page", cvs.width/8,cvs.height/8+280);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("→ : To Next Page", cvs.width/8,cvs.height/8+280);
    ctx.strokeStyle = "#343434";
    ctx.strokeText("→ : To Next Page", cvs.width/8,cvs.height/8+350);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("→ : To Next Page", cvs.width/8,cvs.height/8+350);
    ctx.strokeStyle = "#343434";
    ctx.strokeText("esc : Back To Home", cvs.width/8,cvs.height/8+420);
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText("esc : Back To Home", cvs.width/8,cvs.height/8+420);

  }

  function drawShootingMessage(){
    ctx.fillStyle = "#343434";
    ctx.font =  "100px NotoSans-Regular, sans-serif";
    ctx.translate(-(cvs.width/2+300), -(cvs.height/2));
    ctx.fillText("Taking picture...", 0, 0);
    ctx.translate(cvs.width/2+300, cvs.height/2);
  }

  function draw(image){
    ImageConverter.drawImage(image, cvs, ViewConfig.conf());
    currentImage = image;
  }

  function redraw(){
    clear();
    if(currentImage)draw(currentImage);
  }

  function clear(){
    ctx.clearRect(0, 0, cvs.width, cvs.height);
  }

  function getCurrentImage(){
    return currentImage || false;
  }

  function toDataURL(){
    return cvs.toDataURL();
  }

  function drawMessage(mes, X, Y){
    const
        x = X || 0,
        y = Y || 20;

    ctx.fillStyle = "green";
    ctx.font = "100px ArialRoundedMTBoldBold, serif";
    ctx.rotate(Math.PI);
    ctx.translate(-1500, -800);
    ctx.fillText(mes, x, y);
    ctx.translate(1500, 800);
    ctx.rotate(-Math.PI);
  }

  return {
    init:init,
    draw:draw,
    showWaitMessage:drawWaitingMessage,
    showInstructionMessage:drawInstructionMessage,
    showCalibrateLine:drawCalibrateLine,
    clear:clear,
    redraw:redraw,
    showShootingMessage:drawShootingMessage,
    reset : reset,
    getCtx:getCtx,
    getCvs:getCvs,
    getCurrentImage:getCurrentImage,
    drawMessage:drawMessage,
    toDataURL : toDataURL,
  };
}();

module.exports = MainView;
