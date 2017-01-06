import axios from 'axios';
import Debug from 'debug';

const debug = Debug('fabnavi:api');

let _dispatch = null, _store = null;

function clearHeader() {
  localStorage.removeItem('header');
  localStorage.removeItem('currentUserInfo');
}

function genHeader() {
  const user = _store.getState().user;
  if(user.isLoggedIn) {
    return user.credential;
  }

  // TODO: throw error action to reducer
  debug('this is credential needed request, but credential is not found');
  return null;
}

const WebAPIUtils = {
  init: function(store) {
    _dispatch = store.dispatch;
    _store = store;

    const maybeCredential = this.loadCredential();
    if(maybeCredential) {
      this.getCurrentUserInfo(maybeCredential)
      .catch(error => { debug('error to login ', error) });
    }
  },

  loadCredential: function () {
    try{
      return JSON.parse(localStorage.getItem('credentail'));
    } catch(e) {
      debug('Failed to load credential');
      return null;
    }
  },

  getCurrentUserInfo : function(headers) {
    debug('getCurrentUserInfo');

    return axios({
      responseType : 'json',
      type : 'GET',
      headers,
      url : '/api/v1/current_user.json'
    })
    .then(res => {
      _dispatch({
        type: 'SIGNED_IN',
        credential: headers
      });
    });
  },

  getProject : function( id ) {
    debug('getProject : ', id);
    return axios({
      responseType : 'json',
      type : 'GET',
      headers : genHeader(),
      url : '/api/v1/projects/' + id + '.json'
    })
    .then(({ data }) => {
      _dispatch({
        type: 'RECEIVE_PROJECT',
        project: data
      });
    });
  },

  getOwnProjects : function( uid ) {
    debug('getOwnProjects : ', uid);
    return axios({
      responseType : 'json',
      method : 'GET',
      headers : genHeader(),
      url : '/api/v1/users/' + uid + '/projects.json'
    });
  },

  getAllProjects : function( page, perPage, offset ) {
    debug('getAllProjects');
    return axios({
      responseType : 'json',
      data : {
        page : page || 0,
        perPage : perPage || 20,
        offset : offset || 0
      },
      method : 'GET',
      url : '/api/v1/projects.json'
    })
    .then(({ data }) => {
      _dispatch({
        type: 'RECEIVE_PROJECTS',
        projects: data,
        kind: 'all'
      });
    });
  },


  createProject : function( name, contentAttributesType, description) {
    debug('createProject');
    return axios({
      responseType : 'json',
      data : {
        project : {
          name : name,
          content_attributes : {
            description : description,
            type : 'Content::PhotoList'
          }
        }
      },
      headers : genHeader(),
      method : 'post',
      url : '/api/v1/projects.json'
    })
    .then(res => {
      this.updateProject({
        id: res.id,
        name: res.name,
        content : [],
        description : description,
      });
    });
  },

  setThumbnailLast : function( project ) {
    if(project.content.length == 0) return;
    const fd = new FormData();
    fd.append('project[name]', project.name);
    fd.append('project[figure_id]', project.content[project.content.length - 1].figure.figure_id);
    return axios({
      responseType : 'json',
      headers : genHeader(),
      method : 'patch',
      data  : fd,
      url : `/api/v1/projects/${project.id}.json`
    });
  },

  updateProject : function( project ) {
    debug('updateProject', project);
    const fd = new FormData();
    fd.append('project[name]', project.name);
    fd.append('project[description]', project.description);
    fd.append('project[tag_list]', project.tag_list);
    fd.append('project[private]', project.private);

    let i;
    for(i = 0; i < project.content.length; i++) {

      if( project.content[i].figure.hasOwnProperty('_destroy') &&
        project.content[i].figure._destroy == true &&
        project.content[i].figure.figure_id != null ) {

        debug('Delete photo', project.content[i]);
        fd.append('project[content_attributes][figures_attributes][][type]', 'Figure::Photo');
        fd.append('project[content_attributes][figures_attributes][][attachment_id]', project.content[i].figure.id);
        fd.append('project[content_attributes][figures_attributes][][id]', project.content[i].figure.figure_id);
        fd.append('project[content_attributes][figures_attributes][][position]', i);
        fd.append('project[content_attributes][figures_attributes][][_destroy]', 'true');
      } else {
        fd.append('project[content_attributes][figures_attributes][][type]', 'Figure::Photo');
        fd.append('project[content_attributes][figures_attributes][][attachment_id]', project.content[i].figure.id);
        fd.append('project[content_attributes][figures_attributes][][position]', i);
        fd.append('project[content_attributes][figures_attributes][][_destroy]', 'false');
      }
    }

    return axios({
      responseType : 'json',
      headers : genHeader(),
      method : 'patch',
      data  : fd,
      url : `/api/v1/projects/${project.id}.json`
    });
  },

  deleteProject : function( project ) {
    debug('deleteProject', project);
    return axios({
      responseType : 'json',
      headers : genHeader(),
      method : 'delete',
      url : `/api/v1/projects/${project.id}.json`
    });
  },

  likeProject : function( id ) {
    debug('likeProject');
  },

  unlikeProject : function( id ) {
    debug('unlikeProject');
  },

  likeFigure : function( project_id, figure_id ) {
    debug('likeFigure');
  },

  unlikeFigure : function( project_id, figure_id ) {
    debug('unlikeFigure');
  },

  getCalibrations : function( page, perPage, offset ) {
    debug('getCalibrations');
  },

  createCalibration : function( name, x, y, width, height ) {
    debug('createCalibrations');
  },

  updateCalibration: function( name, x, y, width, height ) {
    debug('updateCalibrations');
  },

  deleteCalibration : function( id ) {
    debug('deleteCalibrations');
  },

  uploadFile : function( file, name, sym ) {
    debug('uploadFile');

    const fd = new FormData();
    fd.append('attachment[file]', file, name);

    return axios({
      responseType : 'json',
      data : fd,
      headers : genHeader(),
      method : 'post',
      url : '/api/v1/attachments.json'
    });
  },

  signOut : function() {
    debug('Not Implemented yet');
  }
};


global.api = WebAPIUtils;
module.exports = WebAPIUtils;
