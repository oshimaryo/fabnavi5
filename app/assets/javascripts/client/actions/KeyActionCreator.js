import Debug from'debug';
import{
  browserHistory
}from'react-router';// pushしたURLに遷移する

const debug = Debug('fabnavi:actions:keys');

export function handleKeyDown(store){
  return event => {
    if(event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
    if(event.metaKey) return 0;
    event.preventDefault();
    event.stopped = true;

    const payload = {
      keyCode: event.keyCode,
      charCode: event.charCode,
      ctrl: event.ctrlKey,
      alt: event.altKey,
      meta: event.metaKey,
      shift: event.shiftKey,
      type: 'NOT_REGISTER'
    };

    const state = store.getState();

    if(state.frame === 'manager'){
      const selector = state.manager.selector;
      payload.selector = selector;
      switch(event.keyCode){
        case 37: // 左
          if(!selector.openMenu){
            moveSelector(store, payload, -1, 0);
          }
          break;
        case 39: // 右
          if(!selector.openMenu){
            moveSelector(store, payload, 1, 0);
          }
          break;
        case 38: // 上
          if(selector.openMenu){
            moveMenuSelector(store, payload, -1);
          } else {
            moveSelector(store, payload, 0, -1);
          }
          break;
        case 40: // 下
          if(selector.openMenu){
            moveMenuSelector(store, payload, 1);
          } else {
            moveSelector(store, payload, 0, 1);
          }
          break;
        case 27:// esc
          closeMenu(store, payload);
          break;
        case 13:// enter
          if(selector.openMenu){
            fireMenuAction(store, payload, state);
          } else {
            openMenu(store, payload);
          }
          break;
        default:
          break;
      }
    } else if(state.frame === 'player'){
      if(state.player.mode === 'play'){
        switch(event.keyCode){
          case 37:
            changePage(store, payload, state, -1);
            break;
          case 39:
            changePage(store, payload, state, 1);
            break;
          case 32:
            togglePlaying(store, payload);
            break;
          case 67:
            changePlayerMode(store, payload);
            break;
          case 27:
            exitPlayer(store, payload);
            break;
          default:
            break;
        }
      } else if(state.player.mode === 'calibrateCenter'){
        switch(event.keyCode){
          case 37:
            calibrate(store, payload, 'MOVE_LEFT');
            break;
          case 38:
            calibrate(store, payload, 'MOVE_UP');
            break;
          case 39:
            calibrate(store, payload, 'MOVE_RIGHT');
            break;
          case 40:
            calibrate(store, payload, 'MOVE_DOWN');
            break;
          case 67:// Shift + c
            changePlayerMode(store, payload);
            break;
          case 27:
            exitPlayer(store, payload);
            break;
          default:
            break;
        }
      } else if(state.player.mode === 'calibrateScale'){
        switch(event.keyCode){
          case 37:
            calibrate(store, payload, 'LONGER_HORIZONTAL');
            break;
          case 39:
            calibrate(store, payload, 'SHORTER_HORIZONTAL');
            break;
          case 38:
            calibrate(store, payload, 'LONGER_VERTICAL');
            break;
          case 40:
            calibrate(store, payload, 'SHORTER_VERTICAL');
            break;
          case 67:
            changePlayerMode(store, payload);
            break;
          case 27:
            exitPlayer(store, payload);
            break;
          default:
            break;
        }
      }
    } else if(state.frame === 'detail'){
      switch(event.keyCode){
        case 27: 
          exitDetail(store, payload);
          break;
        default:
          break;
      }
    }
  };
}

function exitDetail(store, action){
  action.type = 'DETAIL_EXIT';
  store.dispatch(action);
  browserHistory.push('/');
}

function togglePlaying(store, action){
  action.type = 'TOGGLE_PLAYING'
  store.dispatch(action);
}

function calibrate(store, action, command){
  action.type = 'CALIBRATE';
  action.command = command;
  action.step = action.shift ? 10 : 1;
  debug('Calibrate: ', command);
  store.dispatch(action);
}

function exitPlayer(store, action){
  action.type = 'PLAYER_EXIT';
  store.dispatch(action);
  browserHistory.push('/');
}

function changePlayerMode(store, action){
  action.type = 'PLAYER_CHANGE_MODE';
  store.dispatch(action);
}

function changePage(store, action, state, step){
  let page = state.player.page + step;
  const project = state.player.project;
  if(!project.hasOwnProperty('content')){
    return;
  }
  if(page >= project.content.length){
    page = project.content.length - 1;
  }

  if(page < 0){
    page = 0;
  }
  action.type = 'PLAYER_CHANGE_PAGE';
  action.page = page;
  store.dispatch(action);
}

function fireMenuAction(store, action, state){
  action.type = 'FIRE_MENU_ACTION';
  action.selector.openMenu = false;
  store.dispatch(action);
  if(state.manager.selector.action === 'delete'){// deleteを選んだ場合
    api.deleteProject(state.manager.project.id)
      .then(() => {
        api.getOwnProjects();
      });
  } else {// delete以外の場合
    browserHistory.push(`/${state.manager.selector.action}/${state.manager.project.id}`);
  }
}

function openMenu(store, action){
  action.selector.openMenu = true;
  action.selector.menuIndex = 0;
  action.type = 'SELECT_PROJECT_MENU';
  store.dispatch(action);
}

function closeMenu(store, action){
  action.selector.openMenu = false;
  action.type = 'SELECT_PROJECT_MENU';
  store.dispatch(action);
}

function moveMenuSelector(store, action, index){
  // TODO: sanitize menu index.
  action.selector.menuIndex = action.selector.menuIndex + index;
  action.type = 'SELECT_PROJECT_MENU';
  store.dispatch(action);
}

function moveSelector(store, action, x, y){
  // TODO: sanitize col and row.
  const selector = action.selector;
  const state = store.getState(); // 全体のstate取得
  const manager = state.manager;
  const projects = manager.projects;
  const data = projects.length; // 読み込んであるproject全体の長さ
  const contents = data % 8;
  let col = selector.col + x,
      row = selector.row + y;
  if(col < 0) col = 0;
  if(row < 0) row = 0;
  if(col > 3) col = 3;
  if(row > 1) row = 1;

  action.selector = Object.assign({}, selector, {
    col,
    row,
    index: row * 4 + col
  });
  action.type = 'SELECT_PROJECT';
  store.dispatch(action);
}