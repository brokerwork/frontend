import { CardPanelWrapper } from 'components/CardPanel';
import CustomerDetailModal from '../../containers/CustomerDetailModal';
import cs from './ModCustomerModal.less';
import i18n from 'utils/i18n';

export default class ModCustomerModal extends PureComponent {
  componentDidMount() {
    const { customerDetailInfo } = this.props;
    if (!Object.keys(customerDetailInfo).length) {
      this.closeModal();
    }
  }
  closeModal = () => {
    const { history, match: { url }, location } = this.props;
    history.replace({
      pathname: url.replace('/modify', ''),
      state: { ...location.state }
    });
  };
  onOkClick = newValues => {
    const { customerDetailInfo } = this.props;
    let customer = Object.assign({}, customerDetailInfo, newValues);
    this.updateCustomer(customer);
  };

  updateCustomer = customer => {
    const {
      addCustomer,
      updateCustomerData,
      getCustomerList,
      showTopAlert,
      getCustomerDetail,
      getCustomerActivitiesAll,
      getCustomerActivitiesOperate
    } = this.props;
    updateCustomerData(customer);
    addCustomer(customer, 'edit').then(res => {
      if (!res.result) return;
      showTopAlert({
        content: i18n['customer.edit_customer.modify_success'],
        bsStyle: 'success'
      });
      getCustomerList();
      getCustomerActivitiesAll({ customerId: customer.customerId });
      getCustomerActivitiesOperate({ customerId: customer.customerId });
      getCustomerDetail(customer.customerId);
      this.closeModal();
    });
  };
  render() {
    const { customerFormFields } = this.props;
    return (
      <CustomerDetailModal
        fields={customerFormFields}
        className={cs['mod-customer-modal']}
        show
        title={i18n['customer.edit_customer.title']}
        onHide={this.closeModal}
        onCancel={this.closeModal}
        onOk={this.onOkClick}
      />
    );
  }
}
