import { Switch, Route, Redirect } from 'react-router-dom';
import Root from './containers/Root';
import PageWraper from 'components/PageWraper';
import Message from './path/Message';
import Log from './path/Log';
import RoleSetting from './path/RoleSetting';
import LinkSetting from './path/LinkSetting';
import Account from './path/Account';
import Rebate from './path/Rebate';
import TradeMode from './path/Trade';
import DepositWithdraw from './path/DepositWithdraw';
import SearchCondition from './path/SearchCondition';
import NotifyCenter from './path/NotifyCenter';
import CustomReport from './path/CustomReport';
import BlackList from './path/BlackList';
import { injectReducer } from 'utils/injectReducer';
import * as reducers from './reducers';
import cs from './index.less';
import { CardPanelWrapper } from 'components/CardPanel';

injectReducer('settings', reducers);
export default class Custommgmt extends Component {
  render() {
    const props = this.props;
    const footClass = {
      classNames: true
    };
    return (
      <PageWraper
        {...props}
        rebateContent={true}
        className={cs['settings']}
        containerClass={cs.container}
        footer={footClass}
      >
        <Root {...props}>
          <Switch>
            <Route path={`${props.match.path}/message`} component={Message} />
            <Route path={`${props.match.path}/log`} component={Log} />
            <Route
              path={`${props.match.path}/user`}
              render={(
                userProps //role和link联系不大，没放在一个path下
              ) => (
                <Switch>
                  <Route
                    path={`${userProps.match.path}/roleSetting`}
                    component={RoleSetting}
                  />
                </Switch>
              )}
            />
            <Route
              path={`${props.match.path}/linkSetting`}
              component={LinkSetting}
            />
            <Route path={`${props.match.path}/account`} component={Account} />
            <Route path={`${props.match.path}/rebate`} component={Rebate} />
            <Route
              path={`${props.match.path}/searchCondition`}
              component={SearchCondition}
            />
            {/* <Route path={`${props.match.path}/trade`} component={TradeMode} /> */}
            <Route
              path={`${props.match.path}/depositWithdraw`}
              component={DepositWithdraw}
            />
            <Route
              path={`${props.match.path}/NotifyCenter`}
              component={NotifyCenter}
            />
            <Route
              path={`${props.match.path}/customReport`}
              component={CustomReport}
            />
             <Route
              path={`${props.match.path}/blackList`}
              component={BlackList}
            />
            <Redirect
              from={props.match.url}
              to={`${props.match.path}/message`}
            />
          </Switch>
        </Root>
      </PageWraper>
    );
  }
}
