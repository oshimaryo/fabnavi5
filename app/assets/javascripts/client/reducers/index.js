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
  }

};

export default function reducer(state = initialState, action) {
  debug(state, action);
  return state;
}
