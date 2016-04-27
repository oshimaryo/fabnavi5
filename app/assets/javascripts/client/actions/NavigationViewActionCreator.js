 //MenuIcon.react.jsでつかわれている。
//SearchBar.react.jsでつかわれている。
//つまり、押されたかとか文字が入力されているかとか。
const
    ActionTypes = require('../constants/ActionTypes'),
    AppDispatcher = require('../dispatcher/AppDispatcher');

const NavigationViewActionCreator = {

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
