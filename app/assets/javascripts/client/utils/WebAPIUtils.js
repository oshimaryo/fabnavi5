var ProjectServerActionCreator = require('../actions/ProjectServerActionCreator');
var ServerActionCreator = require('../actions/ServerActionCreator');
var $ = require('jquery');
var _accessToken = null;
var _client = null;
var _uid = null;
var DEVELOPMENT = true;

function setHeader(client, uid, accessToken){
  localStorage.setItem("header", JSON.stringify({
    "Client"        : _client,
    "Uid"           : _uid,
    "AccessToken"  : _accessToken
  }));
}

function clearHeader(){
  localStorage.removeItem("header");
}

function loadHeader(){
  var header = localStorage.getItem("header");
  if( header == null || !DEVELOPMENT){
    return null;
  }

  header = JSON.parse(header);
  _client = header.Client;
  _uid = header.Uid;
  _accessToken = header.AccessToken;
  setTimeout(function(){
    ServerActionCreator.signIn(_uid);
  }, 0);
  return header;
}

function genHeader(){
  loadHeader();
  if( _client == null || _uid == null || _accessToken == null){
    return {};
  }

  return {
    "Client"        : _client,
    "Uid"           : _uid,
    "Access-Token"  : _accessToken
  };
}

var WebAPIUtils = {

  getProject : function( id ){
    console.log("getProject : ", id);

    $.ajax({
      dataType : "json",
      type : "GET",
      success : function(res){
        ProjectServerActionCreator.receiveProject( res );
      },
      error : function(err){
        console.log("Error from getProject");
        console.log(err);
      },
      headers : genHeader(),
      url : "/api/v1/projects/" + id + ".json"
    });
  },

  getAllProjects : function( page, perPage, offset ){
    console.log("getProjects");
    _page = page || 0;
    _perPage = perPage || 20;
    _offset = offset || 0;
    $.ajax({
      dataType : "json",
      data : {
        page : _page,
        perPage : _perPage,
        offset : _offset
      },
      type : "GET",
      success : function(res){
        ProjectServerActionCreator.receiveProjects( res );
      },
      error : function(err){
        console.log("Error from getAllProjects");
        console.log(err);
      },
      url : "/api/v1/projects.json"

    });
  },

  createProject : function( name, contentAttributesType, description){
    console.log("createProject");
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
      success : function(res){
        ProjectServerActionCreator.createProjectSuccess( res );
        WebAPIUtils.updateProject({
          id: res.id,
          name: res.name,
          content : [],
          description : description,
        });
      },
      error : function(err){
        console.log("Error from Create Project");
        console.log(err);
      },
      url : "/api/v1/projects.json"

    });
  },

  setThumbnailLast : function( project ){
    if(project.content.length == 0) return;
    var fd = new FormData();
    fd.append("project[name]", project.name);
    fd.append("project[figure_id]", project.content[project.content.length - 1].figure.figure_id);
    $.ajax({
      dataType : "json",
      headers : genHeader(),
      type : "patch",
      data  : fd,
      contentType : false,
      processData : false,
      success : function(res){
        console.log("set thumbnail success: ", res);
      },
      error : function(err){
        console.log("Error from UpdateThumbnail");
        console.log(err);
      },
      url : "/api/v1/projects/" + project.id + ".json"
    });
  },

  updateProject : function( project ){
    console.log("updateProject");
    var fd = new FormData();
    fd.append("project[name]", project.name);
    fd.append("project[description]", project.description);
    fd.append("project[tag_list]", project.tag_list);

    console.log(project.content);
    for(var i = 0; i < project.content.length; i++){

      if( project.content[i].figure.hasOwnProperty("_destroy") &&
        project.content[i].figure._destroy == true &&
        project.content[i].figure.figure_id != null ){

        console.log("Delete photo", project.content[i]);
        if( !confirm("delete photo , index:  " + i)){
          alert("Rollback");
          project.content[i].figure._destroy = false;
          return -1;
        }
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
      success : function(res){
        console.log("upload success: ", res);
        ProjectServerActionCreator.updateProjectSucess({ project: res });

      },
      error : function(err){
        console.log("Error from UpdateProject");
        console.log(err);
      },
      url : "/api/v1/projects/" + project.id + ".json"
    });
  },

  deleteProject : function( project ){
    console.log("deleteProject");
    $.ajax({
      dataType : "json",
      headers : genHeader(),
      type : "delete",
      contentType : false,
      processData : false,
      success : function(res){
        console.log("delete success: ", res);
        ProjectServerActionCreator.deleteProjectSucess( project );
      },
      error : function(err){
        console.log("Error from DeleteProject");
        console.log(err);
      },
      url : "/api/v1/projects/" + project.id + ".json"

    });
  },

  likeProject : function( id ){
    console.log("likeProject");
  },

  unlikeProject : function( id ){
    console.log("unlikeProject");
  },

  likeFigure : function( project_id, figure_id ){
    console.log("likeFigure");
  },

  unlikeFigure : function( project_id, figure_id ){
    console.log("unlikeFigure");
  },

  getCalibrations : function( page, perPage, offset ){
    console.log("getCalibrations");
  },

  createCalibration : function( name, x, y, width, height ){
    console.log("createCalibrations");
  },

  updateCalibration: function( name, x, y, width, height ){
    console.log("updateCalibrations");
  },

  deleteCalibration : function( id ){
    console.log("deleteCalibrations");
  },

  uploadFile : function( file, name, sym ){
    console.log("uploadFile");

    var fd = new FormData();
    fd.append("attachment[file]", file, name);

    $.ajax({
      dataType : "json",
      data : fd,
      processData: false,
      contentType: false,
      headers : genHeader(),
      type : "post",
      success : function(res){
        console.log("Uploaded file");
        console.log( res );
        res.sym = sym;
        ProjectServerActionCreator.uploadAttachmentSuccess( res );
      },
      error : function(xhr, status, err){
        console.log("Error from Upload File :sym", sym);
        console.log(err);
        ProjectServerActionCreator.uploadAttachmentFailed({ xhr:xhr, status:status, err:err, sym:sym });
      },
      url : "/api/v1/attachments.json"
    });
  },

  signIn : function(){
    WebAPIUtils.initPersona();
    navigator.id.request();
  },

  signOut : function (){
    WebAPIUtils.initPersona();
    navigator.id.logout();
  },

  initPersona : function (){
    navigator.id.watch({
      onlogin: function(assertion){
        $.ajax({
          type:"POST",
          url:"/api/v1/auth/sign_in",
          data:{ assertion:assertion },
          dataType:"json",
          success: function(res, status, xhr){
            _accessToken = xhr.getResponseHeader("Access-Token");
            _uid = xhr.getResponseHeader("Uid");
            _client = xhr.getResponseHeader("Client");
            setHeader();
            ServerActionCreator.signIn(res.email);
          },
          error: function(res, status, xhr){
            console.log(res, status, xhr);
            clearHeader();
          }
        });
      },

      onlogout: function(){
        $.ajax({
          type:"DELETE",
          url:"/api/v1/auth/sign_out",
          success: function(res, status, xhr){
            ServerActionCreator.signOut(res);
            clearHeader();
          },
          error: function(res, status, xhr){
            console.log(res, status, xhr);
            clearHeader();
          }
        });
      }
    });
  }
};


global.api = WebAPIUtils;
module.exports = WebAPIUtils;
