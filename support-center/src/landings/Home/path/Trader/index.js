import Root from './containers/Root';
import Routes from './routes';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './controls/reducers';

injectReducer('traderCommon', reducers);

export default () => {
  return (
    <Root>
      <Routes />
    </Root>
  );
};
