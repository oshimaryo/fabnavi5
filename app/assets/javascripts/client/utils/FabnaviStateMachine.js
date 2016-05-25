// Fabnavi Hierarchical Key Handling State Machine js
// this is KeyBind Controller

const
    machina = require('machina'),
    KeyAction = require('../constants/KeyActionTypes'),
    ProjectActionCreator = require('../actions/ProjectActionCreator');

function consume( payload ){
  if( this.keyMap.hasOwnProperty( payload.keyCode ) ){
    const op = this.keyMap[payload.keyCode];
    if( typeof op == "function" ){
      payload.type = op();
    } else {
      payload.type = op;
    }
  }
  return payload;
}

function transitionl2( ){
  let dst = location.hash.split("/")[2];
  if( dst == undefined ){
    dst = "index";
  }
  this.transition(dst);
}

const playerStateMachine = new machina.Fsm({
  initialize : function(){
    console.log("FSM initialize");
  },
  namespace : "playerKeyHandler",
  initialState : "play",
  states : {
    "unInitialized" : {
      _onEnter : function(){
        this.keyMap = [];
      },
    },

    "play" : {
      _onEnter : function (){
        console.log("enter play mode");
        this.keyMap = [];
        // this.keyMap[13] = KeyAction.PROJECT_SHOOT;
        this.keyMap[39] = KeyAction.PROJECT_NEXT_PAGE;
        this.keyMap[37] = KeyAction.PROJECT_PREV_PAGE;
        this.keyMap[27] = KeyAction.EXIT_PROJECT;
        this.keyMap[8] = KeyAction.TOGGLE_DELETE_FLAG;
        this.keyMap[83] = KeyAction.PROJECT_SAVE;

        //Playの時に画像を上下キーで拡大縮小
        this.keyMap[38] = KeyAction.CALIBRATE_ZOOMIN;
        this.keyMap[40] = KeyAction.CALIBRATE_ZOOMOUT;

        this.keyMap[67] = function(){
          this.transition("calibrateCenter");
        }.bind(this);
        ProjectActionCreator.updateCanvas();
      },

      _onExit : function(){
        console.log("exit play mode");
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      }
    },

    "record" : {

      _onEnter : function (){
        console.log("enter record mode");
        ProjectActionCreator.updateCanvas();
      },

      _onExit : function(){
        console.log("exit record mode");
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      }
    },

    "edit" : {
      _onEnter : function (){
        console.log("enter edit mode");
        ProjectActionCreator.updateCanvas();
      },

      _onExit : function(){
        console.log("exit edit mode");
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      },
    },

    "calibrateCenter" : {
      _onEnter : function (){
        console.log("enter calibrate center mode");
        this.keyMap = [];
        this.keyMap[39] = KeyAction.CALIBRATE_MOVE_RIGHT;
        this.keyMap[37] = KeyAction.CALIBRATE_MOVE_LEFT;
        this.keyMap[40] = KeyAction.CALIBRATE_MOVE_DOWN;
        this.keyMap[27] = KeyAction.EXIT_PROJECT;
        this.keyMap[38] = KeyAction.CALIBRATE_MOVE_UP;

        this.keyMap[67] = function(){
          this.transition("calibrateScale");
        }.bind(this);
        ProjectActionCreator.updateCanvas();
      },

      _onExit : function(){
        console.log("exit calibrate center mode");
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      },
    },

    "calibrateScale" : {
      _onEnter : function (){
        console.log("enter calibrate scale mode");
        this.keyMap = [];
        this.keyMap[39] = KeyAction.CALIBRATE_LONGER_HORIZONTAL;
        this.keyMap[37] = KeyAction.CALIBRATE_SHORTER_HORIZONTAL;
        this.keyMap[40] = KeyAction.CALIBRATE_LONGER_VERTICAL;
        this.keyMap[38] = KeyAction.CALIBRATE_SHORTER_VERTICAL;
        this.keyMap[27] = KeyAction.EXIT_PROJECT;

        this.keyMap[67] = function(){
          this.transition("play");
        }.bind(this);
        ProjectActionCreator.updateCanvas();
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      },

      _onExit : function(){
        console.log("exit calibrate scale mode");
      },
    },
  },


});

playerStateMachine.on("consume", function(payload){
  console.log("consume firered-----------");
});

const ProjectSelectorStateMachine = new machina.Fsm({
  initialize : function(){
  },

  initialState : "projects",

  states : {
    projects : {
      _onEnter : function(){
        this.keyMap = [];
        this.keyMap[38] = KeyAction.SELECT_PROJECT_UP;
        this.keyMap[40] = KeyAction.SELECT_PROJECT_DOWN;
        this.keyMap[39] = KeyAction.SELECT_PROJECT_RIGHT;
        this.keyMap[37] = KeyAction.SELECT_PROJECT_LEFT;

        this.keyMap[13] = function(){
          this.transition("actionMenu");
          return KeyAction.SELECT_PROJECT;
        }.bind(this);
      },

      _onExit : function( ){
        this.keyMap = [];
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      },
    },

    actionMenu: {
      _onEnter : function( ){
        this.keyMap = [];
        this.keyMap[38] = KeyAction.SELECT_ACTION_UP;
        this.keyMap[40] = KeyAction.SELECT_ACTION_DOWN;

        this.keyMap[13] = function(){
          this.transition("projects");
          return KeyAction.SELECT_ACTION;
        }.bind(this);

        this.keyMap[27] = function(){
          this.transition("projects");
          return KeyAction.DESELECT_ACTION;
        }.bind(this);
      },

      _onExit : function( ){
        this.keyMap = [];
      },
      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      },
    },

    navigation : {
      _onEnter : function( ){
        this.keyMap = [];
      },
      _onExit : function( ){
        this.keyMap = [];
      },

      consume : function(e){
        const p = consume.call(this, e);
        this.emit("actionFired", p);
      },
    },
  },
});


const managerStateMachine = new machina.Fsm({
  initialState : "index",
  states : {
    "index" : {
      _onEnter : function(){
        console.log("entering index");
      },
      transitionl2 : function(){
        transitionl2.call(this);
      },
      _child : ProjectSelectorStateMachine,
    },

    "create" : {
      transitionl2 : function(){
        transitionl2.call(this);
      },
    },

    "config" : {
      transitionl2 : function(){
        transitionl2.call(this);
      },
    },

    "edit" : {
      transitionl2 : function(){
        transitionl2.call(this);
      },

    },
  },

});

const FSM = new machina.Fsm({
  namespace: "fabnavi",
  initialState : "player",
  states : {
    player : {
      _onEnter : function(){
      },
      _child : playerStateMachine,
      _onExit : function(){
      },
      nestedTransition : function( loc ){
      },
    },
    manager: {
      _onEnter : function(){
      },
      _child : managerStateMachine,
    },
  },
  consume : function( payload ){
    this.handle("consume", payload);
  },

  reload : function( loc ){
    console.log("Nested Transition: ", location.hash.split("/"));
    this.transition(location.hash.split("/")[1]);
    this.handle("transitionl2");
  },
});
global.FSM = FSM;
module.exports = FSM;
