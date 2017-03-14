import Debug from'debug';

import Act from "../actions/Types";

const debug = Debug('fabnavi:reducer:frame');

// const initialState = location.pathname.split('/')[1] === 'play' ? 'player' : 'manager';
const initialState;
const pathName = location.pathname.split('/'[1]);
if(pathName === 'play'){
  initialState = 'player';
} else if(pathName === 'detail'){
  initialState = 'detail';
} else {
  initialState = 'manager;'
}


export default function frameReducer(state = initialState, action){
  switch(action.type){
    case Act.CHANGE_FRAME:
      return action.payload; 
    default:
      return state;
  }
}