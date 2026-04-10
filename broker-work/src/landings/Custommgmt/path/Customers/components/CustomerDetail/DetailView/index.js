import cs from './index.less';
import getFieldValue from 'utils/fieldValue';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../components/ContentCard';
import { Table, Button } from 'lean-ui';
import CustomerDetailModal from '../../../containers/CustomerDetailModal';
import { CUSTOMER_FORM } from '../../CustomerDetailModal';

export default class DetailView extends PureComponent {
  state = {
    hasChange: false,
    editing: true,
    hidding: true,
    duplicateFieldsMap: {}
  };
  onOkClick = newValues => {
    const {
      customerDetailInfo,
      customerFormFields,
      contactFormFields,
      checkDuplicateNew
    } = this.props;
    let customer = Object.assign({}, customerDetailInfo, newValues);
    checkDuplicateNew(
      {
        name: customer.customName,
        phones: customer.phones,
        email: customer.email
      },
      {
        customerFormFields: customerFormFields,
        contactFormFields,
        customerId: customer.customerId
      }
    ).then(() => {
      this.updateCustomer(customer);
    });
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
    addCustomer(customer, 'edit').then(res => {
      if (!res.result) return;
      showTopAlert({
        content: i18n['customer.edit_customer.modify_success'],
        bsStyle: 'success'
      });
      this.toggleEdit(true);
      getCustomerDetail();
      getCustomerActivitiesAll({ customerId: customer.customerId });
      getCustomerActivitiesOperate({ customerId: customer.customerId });
      getCustomerList();
    });
  };
  onChange = () => {
    const { hasChange } = this.state;
    if (!hasChange) {
      this.setState({
        hasChange: true
      });
    }
  };
  setChange = () => {
    this.setState({
      hasChange: false
    });
  };
  onSave = () => {
    const { submitForm } = this.props;
    submitForm(CUSTOMER_FORM);
  };
  onReset = () => {
    const { resetForm } = this.props;
    resetForm(CUSTOMER_FORM);
    this.toggleEdit(false);
    setTimeout(() => {
      this.setState({
        hasChange: false
      });
    });
  };
  toggleEdit = toggle => {
    // this.setState({
    //   editing: toggle
    // });
    if (toggle) {
      const { customerDetailInfo, checkDuplicateNew } = this.props;
      const { phones, email, customName, customerId } = customerDetailInfo;
      checkDuplicateNew(
        {
          name: customName,
          phones: phones,
          email: email
        },
        { customerId },
        false
      ).then(res => {
        if (!res.result) return Promise.resolve(res);
        const { data } = res;
        const duplicateFieldsMap = Object.assign({}, data);
        this.setState({
          duplicateFieldsMap
        });
      });
    }
  };
  render() {
    const {
      userRights,
      customerFormFields,
      customerDetailInfo: { enabled }
    } = this.props;
    const { editing, hasChange, hidding, duplicateFieldsMap } = this.state;
    const filterData = customerFormFields.filter(
      item =>
        ![
          'customerState',
          'oweId',
          'createTime',
          'customName',
          'participant',
          'commendName'
        ].includes(item.key)
    );
    const visitableCustomerFormFields = hidding
      ? filterData.filter((item, i) => i < 8)
      : filterData;
    return (
      <ContentCard
        hidding={hidding}
        onToggle={() => {
          this.setState({
            hidding: !hidding
          });
        }}
        footer={
          <ContentCard.Footer
            border
            min
            dark
            className={`${cs['footer']} ${
              hasChange ? cs['show'] : cs['hidden']
            }`}
          >
            <div className={cs['foot-bottons']}>
              <Button onClick={this.onSave} type="primary">
                {i18n['general.save']}
              </Button>
              <Button onClick={this.onReset}>{i18n['general.cancel']}</Button>
            </div>
          </ContentCard.Footer>
        }
      >
        <ContentCard.Header>
          {/* icon={'fa fa-user'}
          title={i18n['customer.detail.detail_message']} */}
          <ContentCard.Icon
            icon="profile-vertical"
            iconClassName={cs['profile-vertical']}
          />
          <ContentCard.Title>
            {i18n['customer.detail.detail_message']}{' '}
          </ContentCard.Title>
          {/* {editing || !enabled ? (
            undefined
          ) : (
            <ContentCard.Tools>
              {userRights['CUSTOMER_MODIFY'] ? ( //不可编辑
                <div className={cs['edit-button']}>
                  <span
                    className={cs['add-button-link']}
                    onClick={this.toggleEdit.bind(this, true)}
                  >
                    <i className="fa fa-pencil" /> {i18n['general.modify']}
                  </span>
                </div>
              ) : (
                undefined
              )}
            </ContentCard.Tools>
          )} */}
        </ContentCard.Header>
        <ContentCard.Body className={cs['detail-list']}>
          <CustomerDetailModal
            fields={visitableCustomerFormFields}
            className={cs['mod-customer-modal']}
            show
            duplicateFieldsMap={duplicateFieldsMap}
            newFormField={true}
            disabled={!enabled}
            title={i18n['customer.edit_customer.title']}
            type="edit"
            onCancel={this.closeModal}
            onOk={this.onOkClick}
            onFocus={this.onChange}
            onSubmitSuccess={this.setChange}
          />
        </ContentCard.Body>
      </ContentCard>
    );
  }
}
