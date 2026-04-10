import { Switch, Route } from 'react-router-dom';

import Distribution from './path/Distribution';
import MultiAgent from './path/MultiAgent';
import SymbolGroupSetting from './path/SymbolGroupSetting';
import LevelSetting from './path/LevelSetting';
import TransactionRule from './path/MultiAgent/path/TransactionRule';
import DepositRule from './path/MultiAgent/path/DepositRule';
import ProfitRule from './path/MultiAgent/path/ProfitRule';
import FeeReturnsRule from './path/MultiAgent/path/FeeReturnsRule';
import RebateParams from './path/MultiAgent/path/RebateParams';

export default class Message extends Component {
  render() {
    const props = this.props;
    return (
      <Switch>
        <Route
          path={`${props.match.path}/levelSetting`}
          component={LevelSetting}
        />
        <Route
          exact
          path={`${props.match.path}/transactionRuleSetting`}
          component={TransactionRule}
        />
        <Route
          exact
          path={`${props.match.path}/depositRuleSetting`}
          component={DepositRule}
        />
        <Route
          exact
          path={`${props.match.path}/profitRuleSetting`}
          component={ProfitRule}
        />
        <Route
          exact
          path={`${props.match.path}/feeReturnsRuleSetting`}
          component={FeeReturnsRule}
        />
        <Route
          path={`${props.match.path}/distribution`}
          component={Distribution}
        />
        <Route path={`${props.match.path}/multiAgent`} component={MultiAgent} />
        <Route
          path={`${props.match.path}/:rebateType/rebateParams`}
          component={RebateParams}
        />
        <Route
          path={`${props.match.path}/symbolGroupSetting`}
          component={SymbolGroupSetting}
        />
      </Switch>
    );
  }
}
