//Menuのデータとかはここにあるっぽい location.hash
const
    EventEmitter = require('events'),
    machina = require('machina'),
    AppDispatcher = require('../dispatcher/AppDispatcher'),
    ProjectListStore = require('../stores/ProjectListStore'),
    EventTypes = require('../constants/EventTypes'),
    ActionTypes = require('../constants/ActionTypes'),
    KeyActionTypes = require('../constants/KeyActionTypes'),
    NavigationViewActionCreator = require('../actions/NavigationViewActionCreator'),
    ProjectActionCreator = require('../actions/ProjectActionCreator');

let _selector = {
};


const ProjectSelectorStore = Object.assign({}, EventEmitter.prototype, {
  init : function(){
    _selector = {
      index : 0,
      row   : 0,
      col   : 0,
      openMenu : false,
      menuIndex : 0,
    };
  },

  setSelectorByIndex : function setSelectorByIndex(index){
    //validates selector
    let _index = index;
    const projects = ProjectListStore.getProjectsAll();
    if( index >= projects.length ){
      _index = projects.length - 1;
    } else if( index < 0 ){
      _index = 0;
    };
    ProjectSelectorStore.setSelectorIndex(_index);
  },

  explode : function(){
    if(!_selector.openMenu)throw new Error("Ilegal Action");
    const projects = ProjectListStore.getProjectsAll();
    const project = projects[_selector.index];
    switch(_selector.menuIndex){
      case 0:
        setTimeout(function(){
          ProjectActionCreator.playProject( project );
        }, 0);
        _selector.openMenu = false;
        _selector.menuIndex = 0;
        break;
      case 1:
        setTimeout(function(){
          ProjectActionCreator.detailProject( project );
        },0);
        _selector.openMenu = false;
        _selector.menuIndex = 0;
        break;
      case 4:
        setTimeout(function(){
          ProjectActionCreator.deleteProject( project );
        }, 0);
        _selector.openMenu = false;
        _selector.menuIndex = 0;
        break;
      default:
        console.log("do nothing");
        break;
    };
  },
  open : function (){
    _selector.openMenu = true;
    _selector.menuIndex = 0;
    ProjectSelectorStore.emitChange();
  },

  close : function(){
    _selector.openMenu = false;
    ProjectSelectorStore.emitChange();
  },

  up : function(){
    this.setSelectorByIndex( _selector.index - 4 );
    this.scrollUp();
  },

  down : function(){
    this.setSelectorByIndex( _selector.index + 4 );
    this.scrollDown();
  },

  left : function(){
    this.setSelectorByIndex( _selector.index - 1 );
    if((_selector.index + 1) % 4 == 0){
      this.scrollUp();
    }
  },

  right : function(){
    this.setSelectorByIndex( _selector.index + 1 );
    if(_selector.index % 4 == 0){
      this.scrollDown();
    }
  },
//when press key up button , scroll up 380 height
  scrollUp : function(){
    let x = 0;
    const animationTimer = setInterval(function(){
      if(x >= 28){
        clearInterval(animationTimer);
      }
      window.scrollBy(0, -x);
      x += 1;
    }, 5);
    //window.scrollBy(0,-380);
  },
//when press key down button, scroll down 380 height
  scrollDown : function (){
    let x = 0;
    const animationTimer = setInterval(function(){
      if(x >= 28){
        clearInterval(animationTimer);
      }
      window.scrollBy(0, x);
      x += 1;
    }, 5);
  },

  nextAction : function(){
    _selector.menuIndex++;
    if(_selector.menuIndex > 2){
      _selector.menuIndex = 2;
    }
    this.emitChange();
  },

  prevAction : function(){
    _selector.menuIndex--;
    if(_selector.menuIndex < 0){
      _selector.menuIndex = 0;
    }
    this.emitChange();
  },

  setSelectorIndex : function( index ){
    _selector.index = index;
    _selector.col = index % 4;
    _selector.row = Math.floor(index / 4);
    this.emitChange();
  },

  getSelector : function(){
    return _selector;
  },

  emitChange : function(){
    this.emit(EventTypes.PROJECT_SELECTOR_CHANGE);
  },

  addChangeListener: function(callback){
    this.on(EventTypes.PROJECT_SELECTOR_CHANGE, callback);
  },

  removeChangeListener: function(callback){
    this.removeListener(EventTypes.PROJECT_SELECTOR_CHANGE, callback);
  },
});

ProjectSelectorStore.dispatchToken = AppDispatcher.register(function( action ){
  switch( action.type ){
    case KeyActionTypes.SELECT_PROJECT_UP:
      ProjectSelectorStore.up();
      break;
    case KeyActionTypes.SELECT_PROJECT_DOWN:
      ProjectSelectorStore.down();
      break;
    case KeyActionTypes.SELECT_PROJECT_LEFT:
      ProjectSelectorStore.left();
      break;
    case KeyActionTypes.SELECT_PROJECT_RIGHT:
      ProjectSelectorStore.right();
      break;
    case KeyActionTypes.SELECT_PROJECT:
      ProjectSelectorStore.open();
      break;
    case KeyActionTypes.DESELECT_ACTION:
      ProjectSelectorStore.close();
      break;
    case KeyActionTypes.SELECT_ACTION:
      ProjectSelectorStore.explode();
      break;
    case KeyActionTypes.SELECT_ACTION_UP:
      ProjectSelectorStore.prevAction();
      break;
    case KeyActionTypes.SELECT_ACTION_DOWN:
      ProjectSelectorStore.nextAction();
      break;
    case ActionTypes.MOVE_TOP:
      location.hash = "#/manager/transit"
      setTimeout(function(){
        location.hash = "#/manager"
      },0);
      break;
    case ActionTypes.MOVE_MY_PROJECTS:
      location.hash = "#/manager/transit"
      setTimeout(function(){
        location.hash = "#/manager/myprojects"
      },0);
      break;
    case ActionTypes.MOVE_CONFIG:
      location.hash = "#/manager/transit"
      setTimeout(function(){
        location.hash = "#/manager/"
      },0);
      break;
    case ActionTypes.MOVE_NEW_PROJECT:
      location.hash = "#/manager/create"
      break;
    default:
      console.log("Action fired : ", action );
      break;
  };
});

ProjectSelectorStore.init();
module.exports = ProjectSelectorStore;
