import cs from './PersonalAccount.less';
import i18n from 'utils/i18n';
import RealAccountSetting from '../../../../components/OpenAccount/RealAccountSetting';
import RiskDisclosure from '../../../../components/OpenAccount/RiskDisclosure';

export default class PersonalAccount extends PureComponent {
  render() {
    return (
      <div>
        <RealAccountSetting {...this.props} />
        <RiskDisclosure {...this.props} />
      </div>
    );
  }
}
