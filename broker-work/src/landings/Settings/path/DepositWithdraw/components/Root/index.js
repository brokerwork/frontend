import Deposit from '../../containers/Deposit';
import Withdraw from '../../containers/Withdraw';
import Setting from '../../containers/Setting';
import i18n from 'utils/i18n';
import SettingActionBar from 'landings/Settings/components/SettingActionBar';
export default class Root extends PureComponent {
  componentDidMount() {
    const { getDepositWithdrawInfo } = this.props;

    getDepositWithdrawInfo();
  }

  render() {
    return (
      <div>
        <SettingActionBar title={i18n['settings.left_menu.deposit_withdraw']} />
        <Deposit />
        <Withdraw />
        <Setting />
      </div>
    );
  }
}
