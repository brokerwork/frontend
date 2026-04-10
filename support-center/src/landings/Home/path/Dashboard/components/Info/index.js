import Button from 'components/Button';
import cs from './Info.less';
import moment from 'moment';
import { dateTimeFormatStyle } from 'utils/config';
import defaultImage from 'assets/images/default.png';
import i18n from 'utils/i18n';
import Recharge from '../../containers/Recharge';
import VoucherModal from '../../containers/VoucherModal';

export default class Info extends PureComponent {
  state = {
    showRechargeModal: false,
    showVoucherModal: false
  };

  showRechargeModal = () => {
    this.setState({
      showRechargeModal: true
    });
  };

  closeRechargeModal = () => {
    this.setState({
      showRechargeModal: false
    });
  };

  onRecharge = () => {
    const { showTipsModal, getTenantInfo } = this.props;

    showTipsModal({
      content: i18n['dashbord.recharge.modal.charge.pay.message'],
      onConfirm: cb => {
        cb();
        getTenantInfo();
      },
      noCancel: true
    });
    this.closeRechargeModal();
  };

  showVoucher = () => {
    this.setState({ showVoucherModal: true });
  };

  closeVoucherModal = () => {
    this.setState({ showVoucherModal: false });
  };

  render() {
    const { tenantInfo } = this.props;
    const { showRechargeModal, showVoucherModal } = this.state;

    return (
      <div className={cs['info']}>
        <div className={cs['user-info']}>
          <div className={cs['user-pic']}>
            <img src={defaultImage} />
          </div>
          <div className={cs['user-detail']}>
            <div className={cs['name']}>
              {i18n['dashboard.welcome']}，{tenantInfo.tenantName}
            </div>
            <ul className={cs['detail']}>
              <li>
                {i18n['dashboard.tenant.id']}：{tenantInfo.tenantId}
              </li>
              <li>
                {i18n['dashboard.tenant.email']}：{tenantInfo.tenantEmail}
              </li>
              <li>
                {i18n['dashboard.tenant.register.date']}：{moment(tenantInfo.registerTime).format(dateTimeFormatStyle)}
              </li>
            </ul>
          </div>
        </div>
        <div className={cs['balance']}>
          <div className={cs['count']}>
            {i18n['dashbord.recharge.modal.charge.balance']}：
            <span className={cs['count-number']}>${tenantInfo.balance}</span>
          </div>
          <div className={cs.buttonGroup}>
            <Button style="primary" onClick={this.showRechargeModal}>
              {i18n['dashbord.recharge.btn.title']}
            </Button>
            <Button style="primary" onClick={this.showVoucher}>
              {i18n['dashbord.recharge.btn.voucher']}
            </Button>
          </div>
        </div>
        {showRechargeModal ? <Recharge onSave={this.onRecharge} onClose={this.closeRechargeModal} /> : undefined}
        {showVoucherModal && <VoucherModal onCancel={this.closeVoucherModal} />}
      </div>
    );
  }
}
