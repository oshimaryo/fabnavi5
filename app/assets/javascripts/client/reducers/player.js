import Debug from 'debug';

const debug = Debug('fabnavi:reducer:player');

const PlayerModes = [
  'play', 'calibrateCenter', 'calibrateScale'
];
const initialState = {
  mode: 'play', // play, calibrateCenter, calibrateScale, etc...
  contentType: 'photo',
  page: 0,
  project: null
}

export default function playerReducer(state = initialState, action) {
  debug(state, action);

  switch(action.type) {
    case 'PLAYER_CHANGE_PAGE':
      return Object.assign({}, state, {
        page: action.page,
      });
    case 'RECEIVE_PROJECT':
      debug('Receive project: ', action);
      return Object.assign({}, state, {
        project: action.project,
      });
    case 'PLAYER_EXIT':
      return initialState;
    case 'PLAYER_CHANGE_MODE':
      debug('change mode');
      return Object.assign({}, state, {
        mode: nextMode(state)
      });
    default:
      return state;
  }
}


function nextMode(state) {
  let index = PlayerModes.indexOf(state.player.mode) + 1;
  if(index >= PlayerModes.length) {
    index = 0;
  }
  return PlayerModes[index];
}
