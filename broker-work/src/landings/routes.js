import { Route, Switch, withRouter } from 'react-router-dom';
import Async from 'react-code-splitting';
import Home from './Home';
import PageWraper from '../components/PageWraper';
import {
  getCurrentUserRight,
  getUserInfo,
  getVersionRights
} from '../commonActions/actions';
import PageContainer from '../components/v2/PageWraper';
import * as moment from 'moment';
import 'moment/locale/zh-cn';
import 'moment/locale/zh-tw';
import 'moment/locale/ja';
import 'moment/locale/ko';
import { getType as getLanguageType } from 'utils/language';
import LevelRelation from './Bwtauser/containers/LevelRelation';
import CustomMenu from './CustomMenu';

const TaskPage = ({ beforeChange, ...props }) => (
  <Async
    load={import('./TaskPage').then(beforeChange)}
    componentProps={props}
  />
);

// const Taskmgmt = ({ beforeChange, ...props }) => (
//   <Async
//     load={import('./Taskmgmt').then(beforeChange)}
//     componentProps={props}
//   />
// );

const Msgmgmt = ({ beforeChange, ...props }) => (
  <Async load={import('./Msgmgmt').then(beforeChange)} componentProps={props} />
);

const Usermgmt = ({ beforeChange, ...props }) => (
  <Async
    load={import('./Usermgmt').then(beforeChange)}
    componentProps={props}
  />
);

// const AccountPage = ({ beforeChange, ...props }) => (
//   <Async
//     load={import('./AccountPage').then(beforeChange)}
//     componentProps={props}
//   />
// );

const Accountmgmt = ({ beforeChange, ...props }) => (
  <Async
    load={import('./NewAccountmgmt').then(beforeChange)}
    componentProps={props}
  />
);

const Custommgmt = ({ beforeChange, ...props }) => (
  <Async
    load={import('./Custommgmt').then(beforeChange)}
    componentProps={props}
  />
);

// const CustomerPage = ({ beforeChange, ...props }) => (
//   <Async
//     load={import('./CustomerPage').then(beforeChange)}
//     componentProps={props}
//   />
// );

const Settings = ({ beforeChange, ...props }) => (
  <Async
    load={import('./Settings').then(beforeChange)}
    componentProps={props}
  />
);

const TaUsermgmt = ({ beforeChange, ...props }) => (
  <Async
    load={import('./Bwtauser').then(beforeChange)}
    componentProps={props}
  />
);

// const TaUserPage = ({ beforeChange, ...props }) => (
//   <Async
//     load={import('./BwtauserPage').then(beforeChange)}
//     componentProps={props}
//   />
// );

const Runmgmt = ({ beforeChange, ...props }) => (
  <Async load={import('./Runmgmt').then(beforeChange)} componentProps={props} />
);

const Reportmgmt = ({ beforeChange, ...props }) => (
  <Async
    load={import('./Reportmgmt').then(beforeChange)}
    componentProps={props}
  />
);

const ForgotPassword = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './ForgotPassword').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const EmailBind = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './EmailBind').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const ResetPassword = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './ResetPassword').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const Usersetting = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './Usersetting').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const AgentApply = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './AgentApply').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const PersonalNotify = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './PersonalNotifySetting').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const ExportPdf = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './ExportPdf').then(
      beforeChange
    )}
    componentProps={props}
  />
);

const Withdraw = ({ beforeChange, ...props }) => (
  <Async
    load={import('./Withdraw').then(beforeChange)}
    componentProps={props}
  />
);

const Deposit = ({ beforeChange, ...props }) => (
  <Async load={import('./Deposit').then(beforeChange)} componentProps={props} />
);

const BatchWithdraw = ({ beforeChange, ...props }) => (
  <Async
    load={import('./BatchWithdraw').then(beforeChange)}
    componentProps={props}
  />
);

const AutoJumper = ({ beforeChange, ...props }) => (
  <Async
    load={import(/* webpackChunkName: "small-page" */ './External/AutoJumper').then(
      beforeChange
    )}
    componentProps={props}
  />
);

//合规性测试
const AdaptiveTest = ({ beforeChange, ...props }) => (
  <Async
    load={import('./AdaptiveTest').then(beforeChange)}
    componentProps={props}
  />
);

const SecuritySetting = ({ beforeChange, ...props }) => (
  <Async
    load={import('./SecuritySetting').then(beforeChange)}
    componentProps={props}
  />
);
// const CustomMenu = ({ beforeChange, ...props }) => (
//   <Async
//     load={import('./CustomMenu').then(beforeChange)}
//     componentProps={props}
//   />
// );

// const UISample = ({ beforeChange, ...props }) => (
//   <Async
//     load={import('./UISample').then(beforeChange)}
//     componentProps={props}
//   />
// );

// const Dashbaoard = ({beforeChange, ...props}) => (
//   <Async load={import('./Dashboard').then(beforeChange)} componentProps={props} />
// );

import Dashbaoard from './Dashboard';

const RouteWraper = ({ component: Component, path, beforeChange }) => {
  return (
    <Route
      path={path}
      render={p => {
        return <Component {...p} beforeChange={beforeChange} />;
      }}
    />
  );
};

class Routes extends Component {
  hadGetKey = {};
  beforeChange = (key, res) => {
    if (this.hadGetKey[key]) return Promise.resolve(res);
    const { dispatch } = this.props;
    return Promise.all([
      dispatch(getCurrentUserRight()),
      dispatch(getUserInfo()),
      dispatch(getVersionRights())
    ]).then(() => {
      this.hadGetKey[key] = true;
      return res;
    });
  };
  render() {
    const { dispatch, ...props } = this.props;
    const noPageWraper = /(settings|forgotPassword|resetPassword|mailbind|agentApply|msgmgmt|downloadpdf|external|exportBill|adaptiveTest|runmgmt|securityReset)/gi;
    const newPageWraper = /(custommgmt|usermgmt|bwtauser|accountmgmt|taskmgmt|reportmgmt|dashboard)/gi;
    const pathname = props.location.pathname;

    let lang = getLanguageType();
    if (lang === 'ar-AE') {
      lang = 'ar-tn';
    }
    moment.locale(lang);

    if (pathname === '/' || noPageWraper.test(pathname)) {
      return (
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/forgotPassword" component={ForgotPassword} />
          <Route path="/resetPassword" component={ResetPassword} />
          <Route path="/mailbind" component={EmailBind} />
          <Route path="/agentApply" component={AgentApply} />
          <Route path="/external/autoJumper" component={AutoJumper} />
          <Route path="/downloadpdf/:template" component={ExportPdf} />
          <Route path="/exportBill" component={Custommgmt} />
          <Route path="/adaptiveTest" component={AdaptiveTest} />
          <Route path="/securityReset" component={SecuritySetting} />

          <RouteWraper
            beforeChange={this.beforeChange.bind(this, 'settings')}
            path="/settings"
            component={Settings}
          />
          <RouteWraper
            beforeChange={this.beforeChange.bind(this, 'msgmgmt')}
            path="/msgmgmt"
            component={Msgmgmt}
          />
          <RouteWraper
            beforeChange={this.beforeChange.bind(this, 'runmgmt')}
            path="/runmgmt"
            component={Runmgmt}
          />
        </Switch>
      );
    } else if (newPageWraper.test(pathname)) {
      return (
        <PageContainer {...props}>
          <Switch>
            {/* <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'uiSample')}
              path="/uiSample"
              component={UISample}
            /> */}
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'custommgmt')}
              path="/custommgmt"
              component={Custommgmt}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'usermgmt')}
              path="/usermgmt"
              component={Usermgmt}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'bwtauser')}
              path="/bwtauser"
              component={TaUsermgmt}
            />

            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'reportmgmt')}
              path="/reportmgmt"
              component={Reportmgmt}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'accountmgmt')}
              path="/accountmgmt"
              component={Accountmgmt}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'taskmgmt')}
              path="/taskmgmt"
              component={TaskPage}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'dashboard')}
              path="/dashboard"
              component={Dashbaoard}
            />
          </Switch>
        </PageContainer>
      );
    } else {
      return (
        <PageWraper {...props}>
          <Switch>
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'usersetting')}
              path="/usersetting"
              component={Usersetting}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'withdraw')}
              path="/withdraw"
              component={Withdraw}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'deposit')}
              path="/deposit"
              component={Deposit}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'batchWithdraw')}
              path="/batchWithdraw"
              component={BatchWithdraw}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'personalNotify')}
              path="/personalNotify"
              component={PersonalNotify}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'showLevelRelation')}
              path="/showLevelRelation"
              component={LevelRelation}
            />
            <RouteWraper
              beforeChange={this.beforeChange.bind(this, 'customMenu')}
              path="/customMenu/:id"
              component={CustomMenu}
            />
          </Switch>
        </PageWraper>
      );
    }
  }
}

export default withRouter(Routes);
