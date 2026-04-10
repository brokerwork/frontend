import { Switch, Route, Link } from 'react-router-dom';
import { injectReducer } from 'utils/injectReducer';
import BasicInfo from './containers/BasicInfo';
import ChangePwd from './containers/ChangePwd';
import EmailSetting from './containers/EmailSetting';
import MyDeposit from './path/MyDeposit';
import SecuritySetting from './path/SecuritySetting';
import IntroduceLink from './components/IntroduceLink';
import Root from './components/Root';
import * as reducers from './reducers';

injectReducer('usersetting', reducers);

export default ({ history, ...props }) => {
  return (
    <Root {...props}>
      <Switch>
        <Route
          path={`${props.match.url}/mydeposit/:userId`}
          component={MyDeposit}
          {...props}
        />
        <Route path={`${props.match.url}/mydeposit`} component={MyDeposit} />
        <Route path={`${props.match.url}/basicinfo`} component={BasicInfo} />
        <Route
          path={`${props.match.url}/securitySetting`}
          component={SecuritySetting}
        />
        <Route
          path={`${props.match.url}/introduceLink`}
          component={IntroduceLink}
        />
        <Route
          path={`${props.match.url}/emailsetting`}
          component={EmailSetting}
        />
      </Switch>
    </Root>
  );
};
