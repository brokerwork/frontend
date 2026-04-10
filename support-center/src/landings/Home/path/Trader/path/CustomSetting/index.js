import { injectReducer } from 'utils/injectReducer';
import Root from './containers/Root';
import * as reducers from './controls/reducers';

// injectReducer('traderCustomSetting', reducers);

export default props => <Root {...props} key={props.location.pathname} />;
