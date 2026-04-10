import { hadnleActions } from 'redux-actions';
import { combineReducers } from 'redux';
let viriable = handleActions({
    ['']: (state, { payload }) => payload
}, {});

export default combineReducers({ viriable });