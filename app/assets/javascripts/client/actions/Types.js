import keyMirror from"keymirror";

// actionのtype propertyの定義
export default keyMirror({

  FETCHING_PROJECTS: null,
  SELECT_PROJECT: null,
  SELECT_PROJECT_MENU: null,
  FIRE_MENU_ACTION: null,
  RECEIVE_PROJECTS: null,
  RECEIVE_PROJECT: null,

  DETAIL_EXIT: null,
  
  PLAYER_CHANGE_PAGE: null,
  UPDATE_CALIBRATION: null,
  PLAYER_EXIT: null,
  TOGGLE_PLAYING: null,

  SIGNING_OUT: null,
  SIGNED_OUT: null,
  SIGNED_IN: null,
  SIGN_IN_FAILED: null,

  CHANGE_FRAME: null
});