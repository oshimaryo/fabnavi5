import Debug from 'debug';

const debug = Debug('fabnavi:utils');

function getUserIconSrc(project) {
  let src = '';
  if( project.user.image ) {
    src = project.user.image;
  }
  if(src === '') {
    src = '/images/kaffcop_icon/user_icon.png'
  }
  return src;
}

function getThumbnailSrc(project) {
  let src = null;
  try{
    if(project.content.length >= 1) {
      src = project.content[project.content.length - 1].figure.file.file.thumb.url;
    }
    if( src == null || src == '' ) {
      src = '/images/kaffcop_icon/no_thumbnail.png';
    }
    return src;
  } catch(e) {
    debug('Catnnot get project thumbnail src ', e);
    return '/images/kaffcop_icon/no_thumbnail.png';
  }
}

function getUploadDate(project) {
  return project.created_at.replace(/T.*$/, '').replace(/-/g, ' / ');
}


function getDescription(project) {
  if( !project.description ) {
    return '';
  }
  return project.description;
}

export function trimDescription(desc) {
  if( desc.length >= 100 ) {
    return desc.substr(0, 100) + ' . . .';
  }
  return desc;
}

export function sanitizeProject(project) {
  if(!project) {
    return null;
  }
  return Object.assign({}, project, {
    description: getDescription(project),
    date: getUploadDate(project),
    thumbnail: getThumbnailSrc(project),
    userIcon: getUserIconSrc(project)
  });
}
