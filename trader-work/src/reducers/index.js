import { combineReducers } from 'redux'
import auth from './Auth/login'

const rootReducer = combineReducers({
  auth,
});

export default rootReducer;
