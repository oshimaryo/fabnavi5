import Debug from 'debug';
import {
  browserHistory
} from 'react-router';

const debug = Debug('fabnavi:actions:keys');

// 関数で関数を返す
export function handleKeyDown(store) {
  // console.log('--- Store in keyActionCreator.js ---');
  // console.dir(store);
  return event => {// keyBoardEventが入る，つまりkeybodeが押された瞬間
    // console.log('--- event in keyActionCreator.js ---');
    // console.dir(event);
    if (event.target.nodeName == 'INPUT' || event.target.nodeName == 'TEXTAREA') return;
    if (event.metaKey) return 0;
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
    /* -------------------------- */
    // 矢印ボタンを動かすたびに呼び出される
    // 中身は大体同じ -> initialStateから代入されたもの？
    // console.log('state is below');
    // console.dir(state);
    /* -------------------------- */

    if (state.frame === 'manager') {
      // console.log('--- now frame is manager ---');
      const selector = state.manager.selector;
      // console.dir(selector);
      payload.selector = selector;
      switch (event.keyCode) {
        case 37: // 左
          if (!selector.openMenu) {
            moveSelector(store, payload, -1, 0);
          }
          break;
        case 39: // 右
          if (!selector.openMenu) {
            moveSelector(store, payload, 1, 0);
          }
          break;
        case 38: // 上
          // enterを押した状態のselector
          // menuということ
          if (selector.openMenu) {
            // moveMenuSelector(store, payload, -1);
          } else {
            moveSelector(store, payload, 0, -1);
          }
          break;
        case 40: // 下
          if (selector.openMenu) {
            // moveMenuSelector(store, payload, 1);
          } else {
            moveSelector(store, payload, 0, 1);
          }
          break;
        case 27:
          closeMenu(store, payload);
          break;
        case 13:
          if (selector.openMenu) {
            fireMenuAction(store, payload, state);
          } else {
            openMenu(store, payload);
          }
          break;
        default:
          break;
      }
    } else if (state.frame === 'player') {
      // console.log('--- now frame is player ---');
      if (state.player.mode === 'play') {
        // console.log('- playmode play -');
        switch (event.keyCode) {
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
      } else if (state.player.mode === 'calibrateCenter') {
        // console.log('- playmode calibrateCenter -');
        switch (event.keyCode) {
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
          case 67:
            changePlayerMode(store, payload);
            break;
          case 27:
            exitPlayer(store, payload);
            break;
          default:
            break;
        }
      } else if (state.player.mode === 'calibrateScale') {
        // console.log('- playmode calibrateScale -');
        switch (event.keyCode) {
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

    }
  };
}

function togglePlaying(store, action) {
  // console.log('--- togglePlaying function is actioned ---');
  action.type = 'TOGGLE_PLAYING'
  store.dispatch(action);
}

function calibrate(store, action, command) {
  // console.log('--- calibrate function is actioned ---');
  action.type = 'CALIBRATE';
  action.command = command;
  action.step = action.shift ? 10 : 1;
  debug('Calibrate: ', command);
  store.dispatch(action);
}

function exitPlayer(store, action) {
  console.log('------- exitPlayer function is actioned -------');
  action.type = 'PLAYER_EXIT';
  store.dispatch(action);
  console.dir(store.getState());
  browserHistory.push('/');
}

function changePlayerMode(store, action) {
  // console.log('--- changePlayMode function is actioned ---');
  action.type = 'PLAYER_CHANGE_MODE';
  store.dispatch(action);
}

function changePage(store, action, state, step) {
  // console.log('--- changePage function is actioned ---');
  let page = state.player.page + step;
  const project = state.player.project;
  if (!project.hasOwnProperty('content')) {
    return;
  }
  if (page >= project.content.length) {
    page = project.content.length - 1;
  }

  if (page < 0) {
    page = 0;
  }
  action.type = 'PLAYER_CHANGE_PAGE';
  action.page = page;
  store.dispatch(action);
}

function fireMenuAction(store, action, state) {
  // console.log('--- fireMenuAction function is actioned ---');
  // console.dir(store.getState());
  // console.dir(action);
  // console.dir(state);// ここにproject入ってる
  // console.log(state.manager.project.id);
  action.type = 'FIRE_MENU_ACTION';
  action.selector.openMenu = false;
  store.dispatch(action);
  if (state.manager.selector.action === 'delete') {
    api.deleteProject(state.manager.project.id)
      .then(() => {
        api.getOwnProjects();
      });
  } else {
    console.log('id is ' + state.manager.project.id);
    browserHistory.push(`/${state.manager.selector.action}/${state.manager.project.id}`);
  }
}

function openMenu(store, action) {
  // console.log('--- openMenu function is actioned ---');
  action.selector.openMenu = true;
  action.selector.menuIndex = 0;
  action.type = 'SELECT_PROJECT_MENU';
  store.dispatch(action);
}

function closeMenu(store, action) {
  // console.log('--- closeMenu function is actioned ---');
  action.selector.openMenu = false;
  action.type = 'SELECT_PROJECT_MENU';
  store.dispatch(action);
}

// function moveMenuSelector(store, action, index) {
//   // TODO: sanitize menu index.
//   // action.selector.menuIndex = action.selector.menuIndex + index;
//   action.type = 'SELECT_PROJECT_MENU';
//   store.dispatch(action);
// }

// ここで移動が制御される
function moveSelector(store, action, x, y) {
  // TODO: sanitize col and row.
  console.log('--- moveSelector function is actioned ---');
  const selector = action.selector;
  const state = store.getState();// 全体のstate取得
  const manager = state.manager;
  const projects = manager.projects;
  const data = projects.length;// 読み込んであるproject全体の長さ
  console.log('- projects contents in moveSelector -');
  console.dir(state);

  let col = selector.col + x,
      row = selector.row + y;
  // 上下左右の制約
  if (col < 0) col = 0;
  if (row < 0) row = 0;
  if (col > 3) col = 3;
  if (row > 1) row = 1; 

  // console.log(row * 4 + col);
  
  // console.log('col is ' + col + ', row is ' + row);
  action.selector = Object.assign({}, selector, {
    col,
    row,
    index: row * 4 + col
  });
  action.type = 'SELECT_PROJECT';
  store.dispatch(action);
}