import ResetPassword from './containers/ResetPassword.js';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('resetPassword', reducers);
export default ResetPassword;
