import CustomField, { validate } from 'components/v2/CustomField';
import { Field } from 'redux-form';
import { reduxForm } from 'redux-form';
import { get, post } from 'utils/ajax';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import cs from '../../UpdateUserCard.less';
import {
  isRequired,
  isEmail,
  isPositiveNumber,
  isNoDotNumber,
  isNumber
} from 'utils/validate';
import Dropdown, { DropdownForCode } from 'components/v2/Dropdown';
import SearchInput from 'components/v2/SearchInput';
import UserSelector from 'components/v2/UserSelector';
import { Button, Form, Radio, Tooltip } from 'lean-ui';
const RadioGroup = Radio.Group;
import { mt5OpenFilter, mt4Filter } from 'utils/mtFilter';
export const USER_FORM_ACCOUNT_INFO = 'USER_FORM_ACCOUNT_INFO';

class AccountForm extends PureComponent {
  render() {
    const {
      initialValues,
      fields,
      onSubmit,
      onSubmitSuccess,
      disabled,
      children
    } = this.props;
    return (
      <CustomField
        fields={fields}
        onSubmit={onSubmit}
        disabled={disabled}
        onSubmitSuccess={onSubmitSuccess}
        initialValues={initialValues}
      >
        {children}
      </CustomField>
    );
  }
}

const MyForm = reduxForm({
  form: USER_FORM_ACCOUNT_INFO,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: function(values, props) {
    const { serverId, vendor, login, loginRange, commissionAccountOp } = props;
    const customeErrors = validate(values, props);
    const errors = {};
    // 服务器组必填验证
    if (!isRequired(serverId)) {
      errors['serverId'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['usermgmt.form_field.server'] }}
        />
      );
    }
    if (!isRequired(login)) {
      errors['login'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['usermgmt.form_field.login'] }}
        />
      );
    } else if (!isNoDotNumber(login)) {
      errors['login'] = i18n['usermgmt.form_field.error.login_rule_error'];
    } else if (
      commissionAccountOp === 'Add' && //绑定已有账号不验证区间
      loginRange &&
      (loginRange.rebateBeginNo || loginRange.rebateEndNo) // 双0 表示未设置
    ) {
      const { rebateBeginNo, rebateEndNo } = loginRange;
      if (login < rebateBeginNo || (rebateEndNo && login > rebateEndNo)) {
        errors['login'] = i18n['usermgmt.form_field.error.login_range'];
      }
    }

    if (vendor === 'CTRADER') {
      if (
        values.leverage &&
        values.maxLeverage &&
        Number(values.leverage) > Number(values.maxLeverage)
      ) {
        errors['maxLeverage'] =
          i18n['usermgmt.form_field.error.invaild_max_leverage'];
      }
    }

    return Object.assign({}, customeErrors, errors);
  },
  shouldValidate({ values = {}, nextProps, props }) {
    return props.commissionAccountOp !== 'NotBind';
    //props.isComissionAccountOpen;
  },
  enableReinitialize: true
})(AccountForm);

export default class CommissionForm extends Component {
  state = {
    vendor: '',
    serverId: '',
    login: this.props.initialValues.login,
    commissionAccountOp: this.props.isTask
      ? this.props.initialValues.commissionAccountOp
      : this.props.initialValues.login
        ? 'Bind'
        : 'NotBind'
  };

  componentDidMount() {
    this.updateVendorServerId(this.props);
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.serverList.length && nextProps.serverList.length) {
      this.updateVendorServerId(nextProps);
    }
  }
  onServerChange = (selected, item) => {
    const { onServerChange } = this.props;
    const { serverId, vendor } = item;

    this.setState(
      {
        serverId,
        vendor,
        login: ''
      },
      () => {
        if (onServerChange) {
          onServerChange({
            serverId,
            vendor
          });
        }
        this.updateDropdownData();
      }
    );
  };
  updateDropdownData = () => {
    const { serverId, vendor } = this.state;
    const { getAccountDropdownData, accountDropdownData, isTask } = this.props;
    if (serverId && vendor && !accountDropdownData[serverId]) {
      getAccountDropdownData(vendor, serverId);
    }
  };
  updateVendorServerId = props => {
    const { serverList, initialValues, getAccountDropdownData } = props;
    const { vendorServerId, serverId } = initialValues;

    let _vendor = '';
    let _serverId = '';
    if (!serverId && vendorServerId) {
      //无新值有旧格式的值
      [_vendor, _serverId] = vendorServerId.split('_');
    } else if (serverId) {
      _serverId = serverId;
      const matchVendor = serverList.find(item => item.serverId === serverId);
      _vendor = matchVendor && matchVendor.vendor;
    }
    this.setState(
      {
        serverId: _serverId,
        vendor: _vendor
      },
      this.updateDropdownData
    );
  };

  searchInputAjax = v => {
    const { editUserInfo, showTopAlert } = this.props;
    const { vendor, serverId } = this.state;
    if (!v) {
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    if (!(vendor && serverId)) {
      showTopAlert({
        content: i18n['user_setting.basic_info.default_server_select']
      });
      return Promise.resolve({
        result: true,
        data: []
      });
    }
    let copyData = v;
    if (!v) {
      copyData = 0;
    }
    return get({
      url: `/v1/account/manage/fuzzy/${copyData}?returnNum=10`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    });
  };

  handleData = res => {
    if (!res.result) return Promise.reject(false);
    const data = res.data.map(object => {
      return {
        label: object,
        value: object
      };
    });

    return Promise.resolve(data);
  };

  onLoginSelect = selected => {
    this.setState({
      login: selected && selected.value
    });
  };

  clearLogin = () => {
    this.setState({
      login: ''
    });
  };

  onLoginInput = value => {
    this.setState({
      login: value
    });
  };

  autoLogin = () => {
    const rangeLen = 1000000;
    const { accountDropdownData } = this.props;
    const { serverId } = this.state;
    const dropdownData = accountDropdownData[serverId];
    if (!(serverId && dropdownData && dropdownData.loginNoRange)) return;
    let { rebateBeginNo, rebateEndNo } = dropdownData.loginNoRange;
    rebateEndNo = rebateEndNo || rebateBeginNo + rangeLen;
    const result =
      rebateBeginNo + Math.floor(Math.random() * (rebateEndNo - rebateBeginNo));
    this.setState({
      login: `${result}`
    });
  };

  onSubmit = data => {
    const { onSubmit, initialValues } = this.props;
    const { serverId, vendor, login, commissionAccountOp } = this.state;
    let submitData = JSON.parse(JSON.stringify(data));
    submitData = {
      ...submitData,
      serverId,
      login: login,
      vendor,
      oldLogin: initialValues.login,
      commissionAccountOp: commissionAccountOp
    };
    if (onSubmit) {
      return onSubmit(submitData);
    } else {
      return submitData;
    }
  };
  getFormatedFields = fields => {
    const { accountDropdownData } = this.props;
    const { serverId, vendor } = this.state;
    const dropdownData = accountDropdownData[serverId];
    if (!(serverId && dropdownData)) return fields;
    const copyData = JSON.parse(JSON.stringify(fields));
    copyData.forEach(item => {
      switch (item.key) {
        case 'currency':
          item.optionList = dropdownData.currencyData;
          break;
        case 'leverage':
          item.optionList = dropdownData.leverageData;
          break;
        case 'maxLeverage':
          item.optionList = dropdownData.maxLeverageData;
          break;
        case 'group':
          item.optionList = dropdownData.groupData;
          break;
        case 'userGroup':
          item.optionList = dropdownData.userGroupData;
          break;
        case 'userId':
          item.component = this.userSelectGenerator();
          item.fieldType = 'userSelector';
          break;
      }
    });
    if (vendor === 'MT5') {
      return copyData.filter(d => !mt5OpenFilter.includes(d.key));
    }
    if (vendor === 'MT4') {
      return copyData.filter(d => !mt4Filter.includes(d.key));
    }
    return copyData;
  };
  userSelectGenerator = () => {
    return {
      key: 'userSelector',
      factory: (input, disabled) => {
        return (
          <UserSelector
            searchByField
            className={cs['full-control']}
            disabled={disabled}
            value={input.value}
            withRight={true}
            onSelect={input.onChange}
          />
        );
      }
    };
  };
  serverSelectGenerator = ({ meta: { touched, error }, input, disabled }) => {
    const { serverId } = this.state;
    const { serverList } = this.props;
    return (
      <Form.Control error={touched && error}>
        <DropdownForCode
          className={cs['full-control']}
          value={serverId}
          data={serverList}
          disabled={disabled}
          defaultSelect
          onChange={this.onServerChange}
        />
      </Form.Control>
    );
  };

  loginSelectGenerator = ({ meta: { touched, error }, input, disabled }) => {
    const { accountDropdownData, isTask, type, userRights } = this.props;
    const { login, serverId, commissionAccountOp } = this.state;
    const dropdownData = accountDropdownData[serverId];
    let loginPlaceholer = '';
    const unlimitedStr = i18n['usermgmt.form_field.placeholder.unlimited'];
    if (serverId && dropdownData && dropdownData.loginNoRange) {
      const { rebateBeginNo, rebateEndNo } = dropdownData.loginNoRange;
      const loginRangeValue = !(rebateBeginNo || rebateEndNo)
        ? unlimitedStr
        : `${rebateBeginNo ? rebateBeginNo : unlimitedStr} - ${
            rebateEndNo ? rebateEndNo : unlimitedStr
          }`;
      loginPlaceholer = `${
        i18n['usermgmt.form_field.placeholder.login_rebate']
      } ${loginRangeValue}`;
    }
    return (
      <Form.Control error={touched && error}>
        {commissionAccountOp === 'Add' ? (
          <div className={cs['login-box']}>
            <SearchInput
              getData={() => Promise.resolve({ result: true, data: [] })} //去掉搜索功能，本来应该直接换成FormControl 目前bootstrap正在移除，在此分支暂时不处理
              handleData={this.handleData}
              onSelect={this.onLoginSelect}
              onInputChange={this.onLoginInput}
              disabled={disabled}
              className={cs['login-input']}
              value={login}
              autoUpdate
              placeholder={loginPlaceholer}
            />
            <Button
              disabled={!accountDropdownData[serverId] || disabled}
              className={`${cs['login-btn']} main-color`}
              onClick={this.autoLogin}
            >
              <Tooltip
                trigger="hover"
                placement="left"
                title={
                  <div className={cs['tips-content']}>
                    {i18n['usermgmt.form_field.login_auto']}
                  </div>
                }
              >
                <i className="fa fa-hand-o-up" />
              </Tooltip>
              {/* <i className="fa fa-hand-o-up" /> */}
            </Button>
          </div>
        ) : (
          <Dropdown
            searchable
            className={cs['control-width']}
            value={{ label: login, value: login }}
            disabled={disabled}
            deleteIcon={true}
            clearValue={this.clearLogin}
            pipe={this.searchInputAjax}
            handleData={this.handleData}
            onSelect={item => {
              this.onLoginSelect(item);
              input.onChange(item);
            }}
          />
        )}
      </Form.Control>
    );
  };
  onBindTypeChange = (type, value) => {
    const { onIsComissionAccountOpenChange } = this.props;
    const newState = {};
    newState.commissionAccountOp = value;
    this.setState({ ...newState, login: '' });
    if (
      onIsComissionAccountOpenChange &&
      newState.commissionAccountOp !== 'undefined'
    ) {
      onIsComissionAccountOpenChange(newState.commissionAccountOp);
    }
  };
  render() {
    const {
      accountFormColumns,
      serverList,
      onSubmitSuccess,
      onSubmitFail,
      initialValues,
      disabled,
      accountDropdownData,
      isTask,
      userDisabled,
      rights,
      type
    } = this.props;
    let editDisabled =
      type === 'add' ? false : disabled || !rights.editCommissionInfo;
    const { serverId, vendor, login, commissionAccountOp } = this.state;
    const matchedFields =
      (commissionAccountOp === 'Add' && accountFormColumns[vendor]) || [];
    const formattedFields = this.getFormatedFields(matchedFields);
    const dealedInitialValues = Object.assign(
      {},
      formattedFields.reduce((obj, item) => {
        if (typeof item.defaultValue !== 'undefined') {
          obj[item.key] = item.defaultValue;
        }
        return obj;
      }, {}),
      initialValues || {}
    );
    if (dealedInitialValues.enableChangePassword === undefined) {
      dealedInitialValues.enableChangePassword = '0';
    }
    return (
      <div>
        <Form.Item col={1}>
          <Form.Label />
          <div className={cs['bind-radio-group']}>
            <RadioGroup
              name="myradio2"
              type="button"
              disabled={editDisabled}
              value={commissionAccountOp}
              onChange={this.onBindTypeChange.bind(this, 'commissionAccountOp')}
            >
              <Radio value="Bind">
                {i18n['usermgmt.form_field.bind_account']}
              </Radio>
              <Radio value="Add">
                {i18n['usermgmt.form_field.create_account']}
              </Radio>
              <Radio value="NotBind">
                {i18n['usermgmt.form_field.unbind_account']}
              </Radio>
            </RadioGroup>
          </div>
        </Form.Item>
        {commissionAccountOp !== 'NotBind' ? (
          <MyForm
            fields={formattedFields}
            initialValues={dealedInitialValues}
            onSubmit={this.onSubmit}
            onSubmitSuccess={onSubmitSuccess}
            onSubmitFail={onSubmitFail}
            serverId={serverId}
            login={login}
            commissionAccountOp={commissionAccountOp}
            vendor={vendor}
            disabled={editDisabled}
            loginRange={
              accountDropdownData[serverId] &&
              accountDropdownData[serverId].loginNoRange
            }
          >
            <Form.Item key="server" col={2}>
              <Form.Label required>
                {i18n['usermgmt.form_field.server']}:{' '}
              </Form.Label>
              <Field
                component={this.serverSelectGenerator}
                serverList={serverList}
                disabled={editDisabled}
                name="serverId"
              />
            </Form.Item>
            <Form.Item key="login" col={2}>
              <Form.Label required>
                {i18n['usermgmt.form_field.login']}:{' '}
              </Form.Label>
              <Field
                component={this.loginSelectGenerator}
                login={login}
                serverId={serverId}
                disabled={editDisabled}
                commissionAccountOp={commissionAccountOp}
                accountDropdownData={accountDropdownData}
                name="login"
              />
            </Form.Item>
          </MyForm>
        ) : (
          undefined
        )}
        {/* <AgencyInfo
          initialValues={editUserInfo}
          fields={moreFormColumns}
          onSubmit={this.submit}
          onSubmitSuccess={this.submitSuccess.bind(this, 'moreInfo')}
        /> */}
      </div>
    );
  }
}
