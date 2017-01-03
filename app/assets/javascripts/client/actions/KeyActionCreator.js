import Debug from 'debug';

const FSM = require('../utils/FabnaviStateMachine');
const debug = Debug("fabnavi:actions:keys");

export function handleKeyDown(store) {
  return event => {
    if( event.target.nodeName == "INPUT" || event.target.nodeName == "TEXTAREA") return;
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

    const state = store.getState();
    if(state.frame === "manager") {
      const selector = state.manager.selector;
      switch(event.keyCode) {
        case 37:
          if(!selector.openMenu) {
            payload.selector = moveSelector(selector, -1, 0);
            payload.type = "SELECT_PROJECT";
            store.dispatch(payload);
          }
          break;
        case 38:
          if(!selector.openMenu) {
            payload.selector = moveSelector(selector, 0, -1);
            payload.type = "SELECT_PROJECT";
            store.dispatch(payload);
          }
          break;
        case 39:
          if(!selector.openMenu) {
            payload.selector = moveSelector(selector, 1, 0);
            payload.type = "SELECT_PROJECT";
            store.dispatch(payload);
          }
          break;
        case 40:
          if(!selector.openMenu) {
            payload.selector = moveSelector(selector, 0, 1);
            payload.type = "SELECT_PROJECT";
            store.dispatch(payload);
          }
          break;
        case 27:
          payload.selector = closeMenu(selector);
          payload.type = "SELECT_PROJECT_MENU";
          store.dispatch(payload);
          break;
        case 13:
          if(selector.openMenu) {
            payload.selector = closeMenu(selector);
          } else {
            payload.selector = openMenu(selector);
          }
          payload.type = "SELECT_PROJECT_MENU";
          store.dispatch(payload);
          break;
        default:
          break;
      }
    }
    FSM.consume( payload );
  };
}

function openMenu(selector) {
  return Object.assign({}, selector, {
    openMenu: true,
    menuIndex: 0
  });
}

function closeMenu(selector) {
  return Object.assign({}, selector, {
    openMenu: false
  });
}

function moveSelector(selector, x, y) {
  let col = selector.col + x, row = selector.row + y;
  if( col < 0 ) col = 0;
  if( row < 0 ) row = 0;
  return Object.assign({}, selector, {
    col,
    row,
    index: row * 4 + col
  });
}

