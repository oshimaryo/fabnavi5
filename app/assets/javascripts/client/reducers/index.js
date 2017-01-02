import Debug from 'debug';

const debug = Debug("fabnavi:reducer");

const initialState = {

};

export default function reducer(state = initialState, action) {
  debug(state, action);
  return state;
}
