import Debug from 'debug';

const debug = Debug('fabnavi:reducer');
const MenuActions = [
  'play', 'detail', 'edit', 'delete'
];
const initialState = {
  user: {
    isLoggedIn: false,
    credential: {
      accessToken: '',
      client: '',
      uid: '',
    }
  },
  frame: location.pathname.split('/')[1] === 'play' ? 'player' : 'manager',
  manager: {
    projects: [],
    project: null,
    mode: 'allProjects',
    selector: {
      page: 0,
      index: 0,
      row: 0,
      col: 0,
      openMenu: false,
      menuIndex: 0,
      action: null
    }
  },
  player: {
    mode: 'play', // play, calibrateCenter, calibrateScale, etc...
    contentType: 'photo',
    page: 0,
    project: null
  },
  errors: []
};

export default function reducer(state = initialState, action) {
  switch(action.type) {
    case'SIGNED_IN':
      return Object.assign({}, state, {
        user: Object.assign({}, state.user, {
          isLoggedIn: true,
          credential: action.credential
        })
      });
    case'SELECT_PROJECT':
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, {
          project: state.manager.projects[action.selector.index],
          selector: action.selector
        })
      });
    case'SELECT_PROJECT_MENU':
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, {
          selector: Object.assign({}, action.selector, {
            action: MenuActions[state.manager.selector.menuIndex]
          })
        })
      });
    case'FIRE_MENU_ACTION':
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, {
          selector: action.selector
        })
      });
    case'RECEIVE_PROJECTS':
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, {
          projects: action.projects,
          project: action.projects[state.manager.selector.index]
        })
      });
    case'RECEIVE_PROJECT':
      return Object.assign({}, state, {
        [state.frame]: Object.assign({}, state[state.frame], {
          project: action.project,
        })
      });
    case'PLAYER_CHANGE_PAGE':
      return Object.assign({}, state, {
        player: Object.assign({}, state.player, {
          page: action.page,
        })
      });
    default:
      if(action.type.includes('FAILED')) {
        debug(action);
        return Object.assign({}, state, {
          errors: state.errrors.concat({
            message: action.message,
            error: action.error,
            time: action.time
          })
        });
      }
      return state;
  }
}
