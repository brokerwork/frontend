import Root from './containers/Root';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';
injectReducer('personalNotify', reducers);

export default Root;
