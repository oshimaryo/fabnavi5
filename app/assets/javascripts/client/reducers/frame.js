import Debug from 'debug';

const debug = Debug('fabnavi:reducer:frame');
const initialState = location.pathname.split('/')[1] === 'play' ? 'player' : 'manager';

export default function frameReducer(state = initialState, action) {
  switch(action.type) {
    case 'CHANGE_FRAME':
      return action.frame;
    default:
      return state;
  }
}