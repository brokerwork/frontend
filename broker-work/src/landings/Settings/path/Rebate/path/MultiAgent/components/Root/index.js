import { Switch, Route, Redirect } from 'react-router-dom';
import MultiAgentRebateMode from '../MultiAgentRebateMode';
import TransactionRule from '../../path/TransactionRule';
import DepositRule from '../../path/DepositRule';
import ProfitRule from '../../path/ProfitRule';
import FeeReturnsRule from '../../path/FeeReturnsRule';
import RebateParams from '../../path/RebateParams';

export default class MultiAgent extends Component {
  render() {
    const props = this.props;
    const {
      match: { path }
    } = props;
    return (
      <MultiAgentRebateMode {...props}>
        <Switch>
          <Route
            path={`${path}/transactionRuleSetting`}
            render={_props => <TransactionRule {..._props} {...props} />}
          />
          <Route
            path={`${path}/depositRuleSetting`}
            render={_props => <DepositRule {..._props} {...props} />}
          />
          <Route
            path={`${path}/profitRuleSetting`}
            render={_props => <ProfitRule {..._props} {...props} />}
          />
          <Route
            path={`${path}/feeReturnsRuleSetting`}
            render={_props => <FeeReturnsRule {..._props} {...props} />}
          />
          <Route
            path={`${path}/rebateParamsSetting`}
            render={_props => <RebateParams {..._props} {...props} />}
          />
          <Redirect from={path} to={`${path}/levelSetting`} />
        </Switch>
      </MultiAgentRebateMode>
    );
  }
}
