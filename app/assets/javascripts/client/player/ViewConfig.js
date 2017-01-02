const ProjectActionCreator = require('../actions/ProjectActionCreator');
const ViewConfig = function() {
  const
      playModeConfig = {},
      addModeConfig = {};
  let
      _conf = {},
      isCropped = true;

  function init() {
    getLocalConfig();
  }

  function setLocalData(key, jsonData) {
    const data = {};
    if(!isCropped) {
      data["play"] = jsonData;
      const res = getLocalData(key);
      if(res && res.hasOwnProperty("add"))data["add"] = res.add;
    } else {
      data["add"] = jsonData;
      const res = getLocalData(key);
      if(res && res.hasOwnProperty("play"))data["play"] = res.play;
    }
    const d = JSON.stringify(data);
    localStorage.setItem(key, d);
  }

  function getLocalData(key) {
    const data = localStorage.getItem(key);
    return JSON.parse(data);
  }

  function getLocalConfig() {
    const id = "ProjectId";
    let res = getLocalData(id);
    res = res || "";

    if(!isCropped) {
      _conf = res.play || "";
    } else {
      _conf = res.add || "";
    }
  }

  function setLocalConfig(id) {
    if(_conf == "") {
      alert("there is no config");
      return false;
    }
    setLocalData(id, _conf);
  }

  function getConfig() {
    getLocalConfig();
    return normalize(_conf);
  }

  function saveConfig() {
    setLocalConfig("ProjectId");
  }

  function setConfig(conf) {
    _conf = normalize(conf);
    setTimeout(function() {
      ProjectActionCreator.updateCanvas();
    }, 0);
  }

  function normalize(conf) {
    const res = {};
    let c;
    for(c in conf) {
      if(isNaN(conf[c]))res[c] = 0;
      else res[c] = Number(conf[c]);
    }
    return res;
  }

  function getCropped() {
    return isCropped;
  }

  function setCropped(b) {
    isCropped = b;
  }

  return {
    init : init,
    conf:getConfig,
    setConf:setConfig,
    isCropped : getCropped,
    save:saveConfig,
    setCropped : setCropped,
  };

}();

module.exports = ViewConfig;
