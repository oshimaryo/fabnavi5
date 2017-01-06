import Debug from 'debug';

const debug = Debug('fabnavi:reducer:manager');

const MenuActions = [
  'play', 'detail', 'edit', 'delete'
];

const initialState = {
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
}

export default function managerReducer(state = initialState, action) {

  switch(action.type) {
    case 'SELECT_PROJECT':
      return Object.assign({}, state, {
        project: state.projects[action.selector.index],
        selector: action.selector
      });
    case 'SELECT_PROJECT_MENU':
      return Object.assign({}, state, {
        selector: Object.assign({}, action.selector, {
          action: MenuActions[state.selector.menuIndex]
        })
      });
    case 'FIRE_MENU_ACTION':
      return Object.assign({}, state, {
        selector: action.selector
      });
    case 'RECEIVE_PROJECTS':
      return Object.assign({}, state, {
        projects: action.projects,
        project: action.projects[state.selector.index]
      });
    case 'RECEIVE_PROJECT':
      debug('Receive project: ', action);
      return Object.assign({}, state, {
        project: action.project,
      });
    default:
      return state;
  }
}
