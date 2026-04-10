import SecuritySetting from './containers/SecuritySetting.js';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('securitySetting', reducers);
export default SecuritySetting;
