import Root from './containers/Root';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('customMenu', reducers);

export default props => <Root {...props} key={props.location.pathname} />;
