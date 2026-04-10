import Child from './path';
import Root from './containers/Root';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('messages', reducers);

export default props => {
  return (
    <Root {...props}>
      <Child {...props} />
    </Root>
  );
};
