import ForgotPassword from './containers/ForgotPassword.js';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('forgotPassword', reducers);
export default ForgotPassword;
