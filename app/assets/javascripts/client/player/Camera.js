const STUB = false;
const $ = require('jquery');
const Camera = function(){

  let
    connected = false;

  function init(){
    if(document.sonycameracontroller == undefined){
      console.error("Addon is not  installed");
      console.log("install http://crest-multimedia-web.s3.amazonaws.com/tsuka/fabnavi-preview/public/sonycameraremotecontroller.xpi");
      return false;
    }
    document.sonycameracontroller.setup({ ipaddress: "10.0.0.1", port: 10000, version: "1.0" }, true, true);
    return true;
  }

  function zoomOnce(){
    const d = $.Deferred();
    document.sonycameracontroller.zoomIn(function(res){
      setTimeout(function(){
        d.resolve();
      }, 700);
    });
    return d.promise();
  }

  function shoot (){
    const d = $.Deferred();
    if(STUB){
      console.log("Stub");
      const cvs = document.createElement('canvas');
      const ctx = cvs.getContext('2d');
      cvs.width = 1366;
      cvs.height = 768;
      ctx.fillStyle = "green";
      ctx.font = "100px ArialRoundedMTBoldBold, serif";
      ctx.rotate(Math.PI);
      ctx.translate(-1500, -800);
      ctx.fillText(Date.now(), 400, 400);
      ctx.translate(1500, 800);
      ctx.rotate(-Math.PI);
      d.resolve(cvs.toDataURL());
    } else {
      const t = window.setTimeout(function(){
        d.reject("Camera Not Respond");
      }, 3000);
      const listener = function(url, res){
        window.clearTimeout(t);
        setTimeout(function(){
          d.resolve(url);
        }, 100);
      };
      document.sonycameracontroller.take(listener);
    }
    return d.promise();
  }

  function ping(){
    const d = $.Deferred();
    try{
      const r = new XMLHttpRequest();
      const t = window.setTimeout(function(){
        r.abort();
        connected = false;
        d.reject(false);
      }, 2000);
      r.onload = function(e){
        window.clearTimeout(t);
        connected = true;
        d.resolve(true);
      };
      r.open("GET", "http://10.0.0.1:10000", true);
      r.send();
    } catch(e){
      console.error(e);
    }
    return d.promise();
  }

  return {
    init:init,
    shoot:shoot,
    ping:ping,
  };
}();
global.Camera = Camera;
module.exports = Camera;
