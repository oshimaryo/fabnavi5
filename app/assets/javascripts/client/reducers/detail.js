import Debug from 'debug';

import Act from '../actions/Types';

const debug = Debug('fabnavi:reducer:detail');

const initialState = {
    mode: 'projectDetail'
}

export default function detailReducer(state = initialState, action){
    switch(action.type){
        case Act.DETAIL_EXIT :
            debug("detail exit, nothing to do");
            return initialState;
        default:
            return state;
    }
}