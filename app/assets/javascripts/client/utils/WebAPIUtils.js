'use strict';
const ProjectServerActionCreator = require('../actions/ProjectServerActionCreator');
const ServerActionCreator = require('../actions/ServerActionCreator');
const $ = require('jquery');
let _accessToken = null,
    _client = null,
    _uid = null;

const DEVELOPMENT = true;
import Debug from 'debug';

const debug = Debug("fabnavi:api");

function setHeader() {
  localStorage.setItem("header", JSON.stringify({
    "Client"        : _client,
    "Uid"           : _uid,
    "AccessToken"  : _accessToken
  }));
}

function clearHeader() {
  localStorage.removeItem('header');
  localStorage.removeItem("currentUserInfo");
}

function loadHeader() {
  let header = localStorage.getItem("header");

  if( header == null || !DEVELOPMENT) {
    return null;
  }

  try{
    header = JSON.parse(header);
    _client = header.Client;
    _uid = header.Uid;
    _accessToken = header.AccessToken;
    setTimeout(function() {
      ServerActionCreator.signIn(_uid);
    }, 0);
    return header;
  } catch(e) {
    throw new Error("ERROR. JSON.parse failed");
  }
}

function genHeader() {
  loadHeader();
  if( _client == null || _uid == null || _accessToken == null) {
    return {};
  }

  return {
    "Client"        : _client,
    "Uid"           : _uid,
    "Access-Token"  : _accessToken
  };
}

const WebAPIUtils = {

  getCurrentUserInfo : function() {
    debug("getCurrentUserInfo");

    $.ajax({
      dataType : "json",
      type : "GET",
      success : function(res) {
        localStorage.setItem("currentUserInfo", JSON.stringify({
          "Id"        : res.id,
          "Uid"           : res.uid
        }));
      },
      error : function(err) {
        debug("Error from getCurrentUserID");
        debug(err);
      },
      headers : genHeader(),
      url : "/api/v1/current_user.json"
    });
  },

  loadCurrentUserId : function() {
    let currentUser = localStorage.getItem("currentUserInfo");
    if( currentUser == null || !DEVELOPMENT) {
      return null;
    }

    try{
      currentUser = JSON.parse(currentUser);
      return currentUser.Id;
    } catch(e) {
      throw new Error("ERROR. JSON.parse failed");
    }
  },

  getProject : function( id ) {
    debug("getProject : ", id);

    $.ajax({
      dataType : "json",
      type : "GET",
      success : function(res) {
        ProjectServerActionCreator.receiveProject( res );
      },
      error : function(err) {
        debug("Error from getProject");
        debug(err);
      },
      headers : genHeader(),
      url : "/api/v1/projects/" + id + ".json"
    });
  },

  getOwnProjects : function( uid ) {
    debug("getOwnProjects : ", uid);

    $.ajax({
      dataType : "json",
      type : "GET",
      success : function(res) {
        ProjectServerActionCreator.receiveProjects( res );
      },
      error : function(err) {
        debug("Error from getOwnProjects");
        debug(err);
      },
      headers : genHeader(),
      url : "/api/v1/users/" + uid + "/projects.json"
    });
  },

  getAllProjects : function( page, perPage, offset ) {
    debug("getProjects");
    const
        _page = page || 0,
        _perPage = perPage || 20,
        _offset = offset || 0;

    $.ajax({
      dataType : "json",
      data : {
        page : _page,
        perPage : _perPage,
        offset : _offset
      },
      type : "GET",
      success : function(res) {
        ProjectServerActionCreator.receiveProjects( res );
      },
      error : function(err) {
        debug("Error from getAllProjects");
        debug(err);
      },
      url : "/api/v1/projects.json"

    });
  },

  isSigningIn : function() {
    const url = window.location.href;
    if(url.includes("uid") && url.includes("client_id") && url.includes("auth_token")) {
      const token = url.match(/auth_token=([a-zA-Z0-9\-]*)/)[1];
      const uid = url.match(/uid=([a-zA-Z0-9\-]*)/)[1];
      const client_id = url.match(/client_id=([a-zA-Z0-9\-]*)/)[1];
      WebAPIUtils.signedIn(token, uid, client_id);
      window.location.href = window.location.href.split("/")[0] + "/#manager";
    }
    return !!loadHeader();
  },

  createProject : function( name, contentAttributesType, description) {
    debug("createProject");
    $.ajax({
      dataType : "json",
      data : {
        project : {
          name : name,
          content_attributes : {
            description : description,
            type : "Content::PhotoList"
          }
        }
      },
      headers : genHeader(),
      type : "post",
      success : function(res) {
        ProjectServerActionCreator.createProjectSuccess( res );
        WebAPIUtils.updateProject({
          id: res.id,
          name: res.name,
          content : [],
          description : description,
        });
      },
      error : function(err) {
        debug("Error from Create Project");
        debug(err);
      },
      url : "/api/v1/projects.json"

    });
  },

  setThumbnailLast : function( project ) {
    if(project.content.length == 0) return;
    const fd = new FormData();
    fd.append("project[name]", project.name);
    fd.append("project[figure_id]", project.content[project.content.length - 1].figure.figure_id);
    $.ajax({
      dataType : "json",
      headers : genHeader(),
      type : "patch",
      data  : fd,
      contentType : false,
      processData : false,
      success : function(res) {
        debug("set thumbnail success: ", res);
      },
      error : function(err) {
        debug("Error from UpdateThumbnail");
        debug(err);
      },
      url : "/api/v1/projects/" + project.id + ".json"
    });
  },

  updateProject : function( project ) {
    debug("updateProject");
    const fd = new FormData();
    fd.append("project[name]", project.name);
    fd.append("project[description]", project.description);
    fd.append("project[tag_list]", project.tag_list);
    fd.append("project[private]", project.private);

    debug(project.content);
    let i;
    for(i = 0; i < project.content.length; i++) {

      if( project.content[i].figure.hasOwnProperty("_destroy") &&
        project.content[i].figure._destroy == true &&
        project.content[i].figure.figure_id != null ) {

        debug("Delete photo", project.content[i]);
        fd.append("project[content_attributes][figures_attributes][][type]", "Figure::Photo");
        fd.append("project[content_attributes][figures_attributes][][attachment_id]", project.content[i].figure.id);
        fd.append("project[content_attributes][figures_attributes][][id]", project.content[i].figure.figure_id);
        fd.append("project[content_attributes][figures_attributes][][position]", i);
        fd.append("project[content_attributes][figures_attributes][][_destroy]", "true");
      } else {
        fd.append("project[content_attributes][figures_attributes][][type]", "Figure::Photo");
        fd.append("project[content_attributes][figures_attributes][][attachment_id]", project.content[i].figure.id);
        fd.append("project[content_attributes][figures_attributes][][position]", i);
        fd.append("project[content_attributes][figures_attributes][][_destroy]", "false");
      }
    }

    $.ajax({
      dataType : "json",
      headers : genHeader(),
      type : "patch",
      data  : fd,
      contentType : false,
      processData : false,
      success : function(res) {
        debug("upload success: ", res);
        ProjectServerActionCreator.updateProjectSucess({ project: res });

      },
      error : function(err) {
        debug("Error from UpdateProject");
        debug(err);
      },
      url : "/api/v1/projects/" + project.id + ".json"
    });
  },

  deleteProject : function( project ) {
    debug("deleteProject");
    $.ajax({
      dataType : "json",
      headers : genHeader(),
      type : "delete",
      contentType : false,
      processData : false,
      success : function(res) {
        debug("delete success: ", res);
        ProjectServerActionCreator.deleteProjectSucess( project );
      },
      error : function(err) {
        debug("Error from DeleteProject");
        debug(err);
      },
      url : "/api/v1/projects/" + project.id + ".json"

    });
  },

  likeProject : function( id ) {
    debug("likeProject");
  },

  unlikeProject : function( id ) {
    debug("unlikeProject");
  },

  likeFigure : function( project_id, figure_id ) {
    debug("likeFigure");
  },

  unlikeFigure : function( project_id, figure_id ) {
    debug("unlikeFigure");
  },

  getCalibrations : function( page, perPage, offset ) {
    debug("getCalibrations");
  },

  createCalibration : function( name, x, y, width, height ) {
    debug("createCalibrations");
  },

  updateCalibration: function( name, x, y, width, height ) {
    debug("updateCalibrations");
  },

  deleteCalibration : function( id ) {
    debug("deleteCalibrations");
  },

  uploadFile : function( file, name, sym ) {
    debug("uploadFile");

    const fd = new FormData();
    fd.append("attachment[file]", file, name);

    $.ajax({
      dataType : "json",
      data : fd,
      processData: false,
      contentType: false,
      headers : genHeader(),
      type : "post",
      success : function(res) {
        debug("Uploaded file");
        debug( res );
        res.sym = sym;
        ProjectServerActionCreator.uploadAttachmentSuccess( res );
      },
      error : function(xhr, status, err) {
        debug("Error from Upload File :sym", sym);
        debug(err);
        ProjectServerActionCreator.uploadAttachmentFailed({ xhr:xhr, status:status, err:err, sym:sym });
      },
      url : "/api/v1/attachments.json"
    });
  },

  signIn : function() {
    const host = window.location.origin;
    window.location.href = `${host}/auth/github?auth_origin_url=${host}`;
  },

  signedIn : function(token, uid, client) {
    _accessToken = token;
    _uid = uid;
    _client = client;
    setHeader();
  },

  signOut : function() {
    clearHeader();
    window.location.reload();
    setTimeout(function() {
      ServerActionCreator.signOut();
    }, 0);
  }
};


global.api = WebAPIUtils;
module.exports = WebAPIUtils;
