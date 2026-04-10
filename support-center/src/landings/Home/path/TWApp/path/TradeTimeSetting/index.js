import { injectReducer } from 'utils/injectReducer';
import Root from './containers/Root';
import * as reducers from './controls/reducers';

injectReducer('tradeTimeSetting', reducers);

export default Root;