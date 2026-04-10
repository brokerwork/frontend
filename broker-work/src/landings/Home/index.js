import { injectReducer } from 'utils/injectReducer';
import Root from './containers/Login';
import * as loginReducers from './controls/reducers';

injectReducer('login', loginReducers);

export default Root;
