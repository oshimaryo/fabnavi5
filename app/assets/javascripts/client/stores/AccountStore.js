var _accountInfo = {};
var AppDispatcher = require('../dispatcher/AppDispatcher');
var EventTypes = require('../constants/EventTypes');
var ActionTypes = require('../constants/ActionTypes');
var EventEmitter = require('events');
var WebAPIUtils = require('../utils/WebAPIUtils');

var AccountStore = Object.assign({}, EventEmitter.prototype, {
  init : function(){
    _accountInfo.email = window.hasOwnProperty('CURRENT_USER') && window.CURRENT_USER || "";
  },

  emitChange : function(){
    this.emit(EventTypes.ACCOUNT_CHANGE);
  },

  addChangeListener: function(callback){
    this.on(EventTypes.ACCOUNT_CHANGE, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(EventTypes.ACCOUNT_CHANGE, callback);
  },

  getUserEmail : function(){
    return _accountInfo.email
  },

  isSigningIn : function(){
    return _accountInfo.email != "";
  },

  setEmail : function( email ){
    _accountInfo.email = email;
  },

  getAccountInfo : function(){
    return _accountInfo;
  },

  clearEmail : function(){
    _accountInfo.email = "";
  },

});

AccountStore.dispatchToken = AppDispatcher.register(function( action ){
  switch( action.type ){
    case ActionTypes.SIGN_IN :
      WebAPIUtils.signIn();
      break;

    case ActionTypes.SIGN_IN_SUCCESS :
      AccountStore.setEmail(action.email);
      AccountStore.emitChange();
      break;

    case ActionTypes.SIGN_OUT_SUCCESS :
      AccountStore.clearEmail();
      AccountStore.emitChange();
      break;

    case ActionTypes.SIGN_OUT :
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
