import Debug from 'debug';

const debug = Debug("fabnavi:reducer");

const initialState = {
  user: {
    uid: "",
    isLoggedIn: false,
    _secret: {
      accessToken: "",
      client: ""
    }
  },
  frame: "manager",
  manager: {
    projects: [],
    mode: "allProjects",
    selector: {
      page: 0,
      index: 0,
      row: 0,
      col: 0,
      openMenu: false,
      menuIndex: 0
    }
  },
  player: {
    mode: "play"
  }
};

export default function reducer(state = initialState, action) {
  debug(state, action);
  switch(action.type) {
    case"SELECT_PROJECT":
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, { selector: action.selector })
      });
    case"SELECT_PROJECT_MENU":
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, { selector: action.selector })
      });
    case"RECEIVE_PROJECTS":
      return Object.assign({}, state, {
        manager: Object.assign({}, state.manager, { projects: action.projects })
      });
    default:
      return state;
  }
}
