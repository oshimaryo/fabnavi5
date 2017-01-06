import Debug from 'debug';

const debug = Debug('fabnavi:reducer');
const MenuActions = [
  'play', 'detail', 'edit', 'delete'
];
const initialState = {
  user: {
    uid: '',
    isLoggedIn: false,
    _secret: {
      accessToken: '',
      client: ''
    }
  },
  frame: 'manager',
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
    mode: 'play'
  }
};

export default function reducer(state = initialState, action) {
  debug(state, action);
  switch(action.type) {
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
        manager: Object.assign({}, state.manager, {
          project: action.project,
        })
      });
    default:
      return state;
  }
}
