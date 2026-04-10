import { Switch, Route, Redirect } from 'react-router-dom';
import DistributionRebateMode from './components/DistributionRebateMode';
import LevelSetting from '../LevelSetting';
import DistributionRule from './containers/Root';
export default class Distribution extends Component {
  render() {
    const props = this.props;
    const { match: { path } } = props;
    return (
      <DistributionRebateMode {...props}>
        <Switch>
          <Route path={`${path}/levelSetting`} component={LevelSetting} />
          <Route
            path={`${path}/distributionRuleSetting`}
            component={DistributionRule}
          />
          <Redirect from={path} to={`${path}/levelSetting`} />
        </Switch>
      </DistributionRebateMode>
    );
  }
}
