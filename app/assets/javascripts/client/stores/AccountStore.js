const
    _accountInfo = {},
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    EventTypes = require('../constants/EventTypes'),
    ActionTypes = require('../constants/ActionTypes'),
    EventEmitter = require('events'),
    WebAPIUtils = require('../utils/WebAPIUtils');

const AccountStore = Object.assign({}, EventEmitter.prototype, {
  init : function() {
    _accountInfo.uid = window.hasOwnProperty('CURRENT_USER') && window.CURRENT_USER || "";
  },

  emitChange : function() {
    this.emit(EventTypes.ACCOUNT_CHANGE);
  },

  addChangeListener: function(callback) {
    this.on(EventTypes.ACCOUNT_CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.ACCOUNT_CHANGE, callback);
  },

  getUserID : function() {
    return _accountInfo.uid
  },

  isSigningIn : function() {
    return _accountInfo.uid != "";
  },

  setUserID : function( uid ) {
    _accountInfo.uid = uid;
  },

  getAccountInfo : function() {
    return _accountInfo;
  },

  clearUserID : function() {
    _accountInfo.uid = "";
  },

});

AccountStore.dispatchToken = AppDispatcher.register(function( action ) {
  switch( action.type ) {
    case ActionTypes.SIGN_IN :
      WebAPIUtils.signIn();
      break;

    case ActionTypes.SIGN_IN_SUCCESS :
      AccountStore.setUserID(action.uid);
      AccountStore.emitChange();
      break;

    case ActionTypes.SIGN_OUT_SUCCESS :
      AccountStore.clearUserID();
      AccountStore.emitChange();
      break;

    case ActionTypes.SIGN_OUT :
      location.hash = "#/manager"
      WebAPIUtils.signOut();
      break;

    case ActionTypes.CONFIG :
      break;

    default :
      break;
  };

});


AccountStore.init();
module.exports = AccountStore;
