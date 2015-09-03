var AppDispatcher = require('dispatcher/AppDispatcher');
var _projects = {};
var EventTypes = require('constants/EventTypes');
var ActionTypes = require('constants/ActionTypes');

module.exports = ProjectStore = Object.assign({}, EventEmitter.prototype, {
  init : function () {
    _projects = [];
    this.emitChange();
  },

  getProjectsAll : function (){
    return _projects;
  },

  emitChange : function(){
    this.emit(EventTypes.PROJECT_LIST_CHANGE);
  },

  addChangeListener: function(callback) {
    this.on(EventTypes.PROJECT_LIST_CHANGE, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(EventTypes.PROJECT_LIST_CHANGE, callback);
  },
});

ProjectStore.dispatchToken = AppDispatcher.register(function( action ){
  switch(action.type){
    default : 
      break;
  };

});