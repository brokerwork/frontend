import SimulationSetting from './SimulationSetting';
import RealAccountSetting from './RealAccountSetting';
import SameAccountSetting from './SameAccountSetting';
import RiskDisclosure from './RiskDisclosure';
import Tip from './Tip';
export default class OpenAccount extends PureComponent {
  render() {
    const { plat } = this.props;
    return (
      <div>
        {plat !== 'CTRADER' && <SameAccountSetting {...this.props} />}
        <SimulationSetting {...this.props} />
        <RealAccountSetting {...this.props} />
        <RiskDisclosure {...this.props} />
        {plat !== 'CTRADER' && <Tip {...this.props} />}
      </div>
    );
  }
}
