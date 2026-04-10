import CardPanel from 'components/v2/CardPanel';
import { Button, Switch } from 'lean-ui';
import Form, { ACCOUNT_INFO_FORM } from './Form';
import cs from './CreateModal.less';
import i18n from 'utils/i18n';
import SearchCustomer from '../../containers/SearchCustomer';
import { mt5OpenFilter } from 'utils/mtFilter';
import ReduxFormWraper from 'components/v2/ReduxFormWraper';
import _ from 'lodash';

const filterArr = mt5OpenFilter.map(mt => `accountInfo-${mt}`);
const defaultValueMap = {
  city: 'defaultCity',
  checkbox: 'defaultCheckbox'
};

export default class CreateModal extends PureComponent {
  state = {
    next: false,
    activeTab: 'newCustomer',
    selectedCustomer: null,
    customerOwnerInfo: {},
    sendEmail: true,
    relatedAccounts: []
  };

  storeFormValues = null;

  changeTab = activeTab => {
    this.storeFormValues = null;
    this.setState({
      activeTab,
      relatedAccounts: []
    });
  };

  onSelectCustomer = selectedCustomer => {
    const { getOwnerInfo, currentServer } = this.props;

    this.storeFormValues = null;
    this.setState(
      {
        selectedCustomer
      },
      () => {
        getOwnerInfo(selectedCustomer.value, 'CUSTOMER', currentServer).then(
          ({ result, data }) => {
            this.setState({
              customerOwnerInfo: data,
              relatedAccounts:
                (
                  data['baseInfo'] ||
                  data['certificatesInfo'] ||
                  data['financialInfo']
                ).accounts || []
            });
          }
        );
      }
    );
  };

  nextStep = () => {
    this.setState({
      next: true
    });
  };

  prevStep = () => {
    this.setState({
      next: false
    });
  };

  onFormChange = storeFormValues => {
    this.storeFormValues = storeFormValues;
  };

  onSave = () => {
    const { submitForm } = this.props;
    submitForm(ACCOUNT_INFO_FORM);
  };

  onSubmit = values => {
    const {
      createAccount,
      formColumns,
      currentServer,
      showTopAlert,
      onChange,
      bindCtid
    } = this.props;
    const { activeTab, selectedCustomer, sendEmail } = this.state;
    const isNew = activeTab === 'newCustomer';
    const info = Object.keys(values).reduce((value, currentValue) => {
      const strings = currentValue.split('-');
      const form = strings[0];
      const key = strings[1];

      if (!value[form]) {
        value[form] = {};
      }

      if (key === 'localTIN' || key === 'otherTIN') {
        value[form][key] = values[currentValue].filter(
          item => item && item.countryCode && item.tin
        );
      } else {
        value[form][key] =
          key === 'userId'
            ? (values[currentValue] || {}).value
            : values[currentValue];
      }

      return value;
    }, {});

    if (!isNew) {
      info.customerId = selectedCustomer;
    }

    info.sendEmail = sendEmail;

    createAccount(info, currentServer).then(({ result, data }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['account.create_account.create_success']
        });
        onChange();
        if (info.accountInfo && info.accountInfo.ctid) {
          bindCtid(data.login, info.accountInfo.ctid, currentServer);
        }
      }
    });
  };

  filterColumns = () => {
    const {
      formColumns,
      currentServer: { vendor }
    } = this.props;
    const result = {};

    for (let form in formColumns) {
      result[form] = formColumns[form].map(item => ({
        ...item,
        type: item.key === 'bankAccount' ? 'edit' : undefined,
        placeHolder:
          item.key === 'bankAccount'
            ? i18n['withdraw.add_bank.tip']
            : item.placeHolder,
        key: `${form}-${item.key}`,
        fieldType: item.key === 'userId' ? 'userSelector' : item.fieldType,
        optionList:
          item.optionList && item.relationFunc
            ? item.optionList.map(opt => ({
                ...opt,
                relationField: opt.relationField
                  ? `${form}-${opt.relationField}`
                  : undefined
              }))
            : item.optionList
      }));
    }
    if (vendor === 'MT5') {
      result.accountInfo = result.accountInfo.filter(
        ac => !filterArr.includes(ac.key)
      );
    }

    return result;
  };

  filterInfo = () => {
    const { activeTab, next, selectedCustomer, customerOwnerInfo } = this.state;
    const {
      formColumns,
      currentServer: { vendor }
    } = this.props;
    const customerInfo = (selectedCustomer || {})._originData;
    let result = {};

    if (activeTab === 'newCustomer' || (activeTab === 'hasCustomer' && !next)) {
      return {
        ['accountInfo-enableChangePassword']: '1'
      };
    }

    if (this.storeFormValues) {
      result = this.storeFormValues;
    } else {
      const formValues = {
        ...customerOwnerInfo,
        customerInfo,
        accountInfo: [...formColumns.accountInfo].reduce(
          (value, currentValue) => ({
            ...value,
            [currentValue.key]:
              currentValue[
                defaultValueMap[currentValue.fieldType] || 'defaultValue'
              ]
          }),
          {}
        )
      };

      for (let form in formValues) {
        for (let key in formValues[form]) {
          let value = formValues[form][key];

          if (!value) {
            const column = formColumns[form].find(col => col.key === key) || {};

            value = column[defaultValueMap[column.fieldType] || 'defaultValue'];
          }

          result[`${form}-${key}`] = value;
        }
      }

      if (customerInfo && customerInfo.oweId) {
        result['accountInfo-userId'] = {
          label: customerInfo.oweName,
          value: customerInfo.oweId
        };
      }

      if (vendor === 'MT5') {
        result['accountInfo-updatePasswordNextTime'] = '0';
        result['accountInfo-enableOtp'] = '0';
      }
      result['accountInfo-enableChangePassword'] = '1';
    }

    return result;
  };

  filterRequiredCheckbox = (fields = []) => {
    let i = 0;
    const _len = fields.length;
    const checkboxs = [];
    while (i < _len) {
      const field = fields[i];
      if (
        field.fieldType === 'singleCheckbox' &&
        field.validateType &&
        field.validateType.required
      )
        checkboxs.push(field.key);
      i++;
    }
    return checkboxs;
  };

  render() {
    const {
      onClose,
      currentServer,
      passwordRegular,
      accountRange,
      accountTypes,
      versionRights
    } = this.props;
    const {
      next,
      activeTab,
      selectedCustomer,
      sendEmail,
      relatedAccounts
    } = this.state;

    const info = this.filterInfo();
    const columns = this.filterColumns();
    const fields = [
      ...columns.accountInfo,
      ...columns.baseInfo,
      ...columns.certificatesInfo,
      ...columns.financialInfo,
      ...columns.customerInfo
    ];
    const requiredCheckboxs = this.filterRequiredCheckbox(fields);
    return (
      <CardPanel
        show={true}
        onClose={onClose}
        title={i18n['account.create_account.title']}
      >
        <div className={cs['container']}>
          {/** todo
          1.确定绑定对象 -> 2.填写账户信息
          感觉有点问题 先注释掉 */}
          {/* <div className={cs['status-bar']}>
          <div className={`${cs['status']} ${cs['active']}`}>
            <span>1</span>
            {i18n['account.create_account.status.first']}
          </div>
          <div
            className={`${cs['status']} ${
              next || activeTab === 'newCustomer' ? cs['active'] : ''
            }`}
          >
            <span>2</span>
            {i18n['account.create_account.status.next']}
          </div>
        </div>
        {next || activeTab === 'newCustomer'
          ? i18n['account.create_account.status.first']
          : i18n['account.create_account.status.next']} */}
          <div className={cs['head-type']}>
            <Button.Group>
              <Button
                type={activeTab === 'newCustomer' ? 'primary' : 'default'}
                onClick={this.changeTab.bind(this, 'newCustomer')}
              >
                {i18n['account.create_account.tabs.new_customer']}
              </Button>
              <Button
                type={activeTab === 'hasCustomer' ? 'primary' : 'default'}
                onClick={this.changeTab.bind(this, 'hasCustomer')}
              >
                {i18n['account.create_account.tabs.has_customer']}
              </Button>
            </Button.Group>
          </div>
          <div className={cs['content']}>
            {activeTab === 'hasCustomer' && !next ? (
              <SearchCustomer
                value={selectedCustomer}
                onSelect={this.onSelectCustomer}
              />
            ) : (
              undefined
            )}

            {activeTab === 'newCustomer' ||
            (activeTab === 'hasCustomer' && next) ? (
              <ReduxFormWraper
                reduxForm={Form}
                relatedAccounts={relatedAccounts}
                setDefaultValue={activeTab === 'newCustomer'}
                initialValues={info}
                requiredCheckboxs={requiredCheckboxs}
                columns={columns}
                fieldsPropKey="columns"
                fields={fields}
                currentServer={currentServer}
                passwordRegular={passwordRegular}
                accountRange={accountRange}
                onSubmit={this.onSubmit}
                onChange={this.onFormChange}
                accountTypes={accountTypes}
                versionRights={versionRights}
              />
            ) : (
              undefined
            )}
          </div>
        </div>
        <div className={`${cs['cardContent']} ${cs['send-email']}`}>
          <div className={cs['send-email-label']}>
            {i18n['account.create.send_email']}
          </div>
          <Switch
            checked={sendEmail}
            onChange={checked => {
              this.setState({ sendEmail: checked });
            }}
          />
        </div>

        <CardPanel.Footer>
          <div className={cs['footer-buttons']}>
            {activeTab === 'hasCustomer' && !next ? (
              <Button
                type="primary"
                disabled={!selectedCustomer}
                onClick={this.nextStep}
              >
                {i18n['account.create_account.buttons.next']}
              </Button>
            ) : (
              undefined
            )}
            {activeTab === 'hasCustomer' && next ? (
              <Button type="primary" onClick={this.prevStep}>
                {i18n['account.create_account.buttons.prev']}
              </Button>
            ) : (
              undefined
            )}

            {activeTab === 'newCustomer' ||
            (activeTab === 'hasCustomer' && next) ? (
              <Button type="primary" onClick={_.debounce(this.onSave, 500)}>
                {i18n['account.create_account.buttons.finish']}
              </Button>
            ) : (
              undefined
            )}

            <Button onClick={onClose}>
              {i18n['account.create_account.buttons.cancel']}
            </Button>
          </div>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}
