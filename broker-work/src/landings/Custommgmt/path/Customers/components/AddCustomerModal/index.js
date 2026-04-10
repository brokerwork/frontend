import { CardPanelWrapper } from 'components/CardPanel';
import CustomerDetailModal from '../../containers/CustomerDetailModal';
import cs from './AddCustomerModal.less';
import i18n from 'utils/i18n';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import CardPanel from 'components/v2/CardPanel';
import { CUSTOMER_FORM } from '../CustomerDetailModal';
import { Button, Card } from 'lean-ui';
class AddCustomerModal extends PureComponent {
  closeModal = () => {
    const {
      history,
      match: { url }
    } = this.props;
    history.push(url.replace('/create', ''));
  };
  componentWillMount() {
    const { updateCustomerDetail } = this.props;
    updateCustomerDetail({}); //清空当前选择过的客户数据
  }
  componentDidMount() {
    const { userInfo, updateCustomerDetail } = this.props;
    const customerDetailInfo = {
      oweId: userInfo.id,
      oweName: userInfo.name
    };
    updateCustomerDetail(customerDetailInfo);
  }

  onOkClick = values => {
    const {
      checkDuplicateNew,
      customerFormFields,
      contactFormFields
    } = this.props;
    checkDuplicateNew(
      {
        name: values.customName,
        phones: values.phones,
        email: values.email
      },
      {
        customerFormFields: customerFormFields,
        contactFormFields
      }
    ).then(() => this.createCustomer(values));
  };

  createCustomer = values => {
    const { addCustomer, showTopAlert, getCustomerList } = this.props;
    addCustomer(values, 'add').then(res => {
      if (!res.result) return;
      showTopAlert({
        content: i18n['customer.create_customer_success'],
        bsStyle: 'success'
      });
      getCustomerList();
      this.closeModal();
    });
  };
  onSubmit = () => {
    const { submitForm } = this.props;
    submitForm(CUSTOMER_FORM);
  };
  formatFormFields = () => {
    const {
      customerFormFields,
      customerStates,
      selectableCustomerStateKeys
    } = this.props;
    const customerStateField = {
      key: 'customerState',
      label: i18n['customer.state_type'],
      columns: '1',
      enable: true,
      fieldType: 'select',
      show: true,
      optionList: customerStates.filter(
        item => item.value && selectableCustomerStateKeys.includes(item.value)
      ),
      validateType: { required: true }
    };
    return [customerStateField, ...customerFormFields];
  };
  render() {
    const {
      customerDetailModalInfo,
      customerFormFields,
      customerStates
    } = this.props;
    const formatedFields = this.formatFormFields();
    return (
      <CardPanel
        title={i18n['customer.create_customer']}
        show={true}
        onClose={this.closeModal}
      >
        <Card>
          <CustomerDetailModal
            fields={formatedFields}
            className={cs['add-customer-modal']}
            show={true}
            onOk={this.onOkClick}
            type="add"
          />
        </Card>
        <CardPanel.Footer className={cs['footer']}>
          <Button onClick={this.closeModal}>{i18n['general.cancel']}</Button>
          <Button type="primary" onClick={this.onSubmit}>
            {i18n['general.confirm']}
          </Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}

export default injectIntl(AddCustomerModal);
