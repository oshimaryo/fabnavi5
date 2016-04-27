//何が押されたかとか。こちらは常に動いているのでviewから呼び出されるものではない？
const AppDispatcher = require('../dispatcher/AppDispatcher.js');
//キー操作とかの変数名が入っている
const ActionTypes = require('../constants/ActionTypes');
const FSM = require('../utils/FabnaviStateMachine');

const KeyActionCreator = {
  handleKeyDown : function ( event ){
    //if input element changed, 'handleKeyDown' does't handle keyEvent
    if( event.target.nodeName == "INPUT" || event.target.nodeName == "TEXTAREA") return;
    //if metakey pressed, Fabnavi won't handle this keyEvent
    if(event.metaKey) return 0;
    event.preventDefault();
    event.stopped = true;

    const payload = {
      keyCode : event.keyCode,
      charCode: event.charCode,
      ctrl    : event.ctrlKey,
      alt     : event.altKey,
      meta    : event.metaKey,
      shift   : event.shiftKey,
      type    : "NOT_REGISTER",
    };
    FSM.consume( payload );
  },
}
FSM.on("actionFired", function( payload ){
  AppDispatcher.dispatch( payload );
});

module.exports = KeyActionCreator;
window.onkeydown = KeyActionCreator.handleKeyDown;
