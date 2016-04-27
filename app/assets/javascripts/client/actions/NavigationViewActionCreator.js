 //MenuIcon.react.jsでつかわれている。
//SearchBar.react.jsでつかわれている。
//つまり、押されたかとか文字が入力されているかとか。
var ActionTypes = require('../constants/ActionTypes');
var AppDispatcher = require('../dispatcher/AppDispatcher');
var NavigationViewActionCreator = {

  search : function ( act, text ){
    AppDispatcher.dispatch({
      type  : ActionTypes.PROJECT_SEARCH,
      text  : text,
    });
  },

  menuSelect: function ( act ){
    if( ActionTypes.hasOwnProperty(act) ){
      AppDispatcher.dispatch({
        type : ActionTypes[act]
      });
    }
  },
}

module.exports = NavigationViewActionCreator;
