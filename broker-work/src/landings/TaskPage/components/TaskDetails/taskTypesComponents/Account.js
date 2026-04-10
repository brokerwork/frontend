import CustomField, { validate } from 'components/v2/CustomField';
import { isRequired, isNumber } from 'utils/validate';
import { reduxForm, Field } from 'redux-form';
import cs from '../TaskDetails.less';
import { Tabs, Input, Form, Tooltip } from 'lean-ui';
const Tab = Tabs.TabPane;
import i18n from 'utils/i18n';
import Dropdown from 'components/v2/Dropdown';
import DropdownForCode from 'components/v2/DropdownForCode';
import { post } from 'utils/ajax';
import { FormattedMessage } from 'react-intl';
import EllipsisContent from 'components/v2/EllipsisContent';
import { renderField, required } from 'utils/v2/renderField';
import UserSelector from 'components/v2/UserSelector';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { dateTimeFormatStyle } from 'utils/config';
import getIdNum from 'utils/getIdNum';
import { VIEW_TYPE } from '../../../contants';
import _ from 'lodash';
import ReduxFormWraper from 'components/v2/ReduxFormWraper';
import { getType } from 'utils/language';

export const ACCOUNT_FORM_BASIC_INFO = 'TASKS_DETAILS_ACCOUNT_FORM_BASIC_INFO';
export const ACCOUNT_FORM_ID_INFO = 'TASKS_DETAILS_ACCOUNT_FORM_ID_INFO';
export const ACCOUNT_FORM_ACCOUNT_INFO =
  'TASKS_DETAILS_ACCOUNT_FORM_ACCOUNT_INFO';
export const ACCOUNT_FORM_FINACIAL_INFO =
  'TASKS_DETAILS_ACCOUNT_FORM_FINACIAL_INFO';
const typeMap = {
  1: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'drivingLicenceNumberGbg',
    'drivingLicenceStateGbg'
  ], //驾照
  2: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'shortPassportNumberGbg',
    'passportCountryGbg'
  ], //澳洲护照
  3: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'passportMrzNumberFullGbg',
    'genderGbg',
    'countryOfOriginGbg',
    'passportDateOfExpiryGbg'
  ], //国际护照
  4: [
    'firstNameGbg',
    'surNameGbg',
    'dobGbg',
    'buildingGbg',
    'streetGbg',
    'cityGbg',
    'stateGbg',
    'postcodeGbg',
    'drivingLicenceNumberGbg',
    'drivingLicenceStateGbg',
    'medicareNumberGbg',
    'medicareReferenceNumberGbg',
    'dateOfExpiryGbg',
    'cardColourGbg'
  ], //医保卡
  5: ['residentIdentityNumberGbg', 'foreNameGbg', 'surNameZhGbg', 'countryGbg'] //中国验证
};
export default class Account extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      accountInfoDataReady: false,
      // idReady: false,
      currentIdType: ''
    };

    this.defaultTabKey = props.activeKey.toString() || '1';
  }
  componentDidMount() {
    const {
      getExternalFormData,
      initialValues,
      getSameAccount,
      data
    } = this.props;
    this.onChange(initialValues.step1);
    const { customerId, account } = initialValues;
    const __arr = [];
    if (customerId && getSameAccount) {
      getSameAccount(customerId);
    }

    // 查询关联账户情况
    if (account.userId) {
      __arr.push({
        key: 'accountAttributionName',
        value: account.userId,
        fieldName: 'accountAttribution'
      });
    }

    const idNum = getIdNum(initialValues.step3, data.t_account_id_info);

    if (idNum) {
      __arr.push({
        key: 'existIdNumEntity',
        value: idNum,
        fieldName: 'existIdNumEntity',
        excludeCustomer: customerId
      });
    }

    if (__arr.length > 0) {
      getExternalFormData(__arr).then(() => {
        this.setState({
          accountInfoDataReady: true
        });
      });
    } else {
      this.setState({
        accountInfoDataReady: true
      });
    }
  }
  toggleTab = key => {};
  __submitData = {};
  __errors = [];
  __errorTimer = 0;
  submit = (fileds = [], data) => {
    // 过滤敏感字段
    return this.sensiFilter(data, fileds);
  };
  submitFail = errors => {
    const { showTopAlert } = this.props;
    for (let k in errors) {
      if (errors[k]) this.__errors.push(errors[k]);
    }
    if (this.__errorTimer) {
      clearTimeout(this.__errorTimer);
    }
    this.__errorTimer = setTimeout(() => {
      this.__errorTimer = 0;
      if (this.__errors.length > 0) {
        showTopAlert({
          content: (
            <ul>
              {this.__errors.map((item, index) => {
                const content = Array.isArray(item)
                  ? item.find(err => err)
                  : item;
                return <li key={index}>{content}</li>;
              })}
            </ul>
          ),
          bsStyle: 'danger'
        });
        this.__errors = [];
      }
    }, 10);
    this.__submitData = {};
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  };
  submitSuccess(field, data) {
    const {
      accountDropdownData: {
        leverageData,
        serverGroupsData,
        userGroupsData
      } = {}
    } = this.props;
    if (field === 'account') {
      const snapshot = {
        leverageName: getLabelOfListItem(leverageData, data.leverage),
        userGroupName: getLabelOfListItem(userGroupsData, data.userGroup),
        serverIdName: getLabelOfListItem(serverGroupsData, data.serverId)
      };
      this.__submitData = {
        ...this.__submitData,
        snapshot
      };
    }
    this.__submitData[field] = data;
    if (Object.keys(this.__submitData).length === 5) {
      this.props.onSubmit(this.__submitData);
      // 将数据给到外部接收函数后，清除记录的数据。
      // 防止外部点取消时，取到未更新的数据
      this.__submitData = {};
    }
  }
  iDInfoValidate = values => {
    const { idType, idNum } = values;
    const {
      data: { t_account_id_info = [] } = {},
      initialValues: { customerId }
    } = this.props;
    // 调用ref中的方法，并传入校验值
    if (this.idNumRef) {
      this.idNumRef.onFormParamChange({
        idTypeIs5:
          t_account_id_info.some(item => item.key == 'idType') && idType == 5,
        idType,
        idNum,
        excludeCustomer: customerId
      });
    }
    // 不抛出错误
    return Promise.resolve();
  };
  onIdInfoFormChange = data => {
    if (!data.idType || data.idType === this.state.currentIdType) {
      return;
    }
    this.setState({
      currentIdType: data.idType
    });

    this.iDInfoValidate(data);
  };
  // 获取到idNum的组件ref，用作非错误提示验证
  idNumRef = null;
  idNumComponent = (exchangeRate, maxLength) => {
    const { touchFromField } = this.props;
    // 指定更新提示"身份证明“验证的显示
    if ('existIdNumEntity' in this.props.initialValues.externalData)
      setTimeout(() => {
        touchFromField(ACCOUNT_FORM_ID_INFO, 'idNum');
      }, 300);
    return {
      key: 'ID_NUM_COMPONENT',
      factory: (input, disabled, config) => {
        const { placeholder, maxLength } = config;
        return (
          <IdInfoFormControl
            ref={input => (this.idNumRef = input)}
            {...this.props}
            {...{ input, disabled, placeholder, maxLength }}
          />
        );
      }
    };
  };
  injectExistIdNumWarning = fields => {
    const { data: { t_account_id_info = [] } = {}, jobType } = this.props;
    const copyData = _.cloneDeep(t_account_id_info);
    return copyData.map(item => {
      if (item.key === 'idNum' && jobType === 'JOB_TYPE_TA_OPEN') {
        item.fieldType = 'ID_NUM_COMPONENT';
        item.component = this.idNumComponent();
      }
      return item;
    });
  };
  sensitiveParse = (fields = []) => {
    const { userRights } = this.props;
    return fields.map(f => {
      return {
        ...f,
        oldReadonly: f.readonly,
        readonly: f.sensitive
          ? userRights['TASK_SENSITIVE']
            ? f.readonly
            : true
          : f.readonly,
        fieldType:
          f.sensitive &&
          f.fieldType === 'image' &&
          !userRights['TASK_SENSITIVE']
            ? 'text'
            : f.fieldType
      };
    });
  };
  sensiFilter = (data, fields = []) => {
    const { userRights } = this.props;
    const copyData = _.cloneDeep(data);
    fields.forEach(f => {
      const isSense = f.sensitive
        ? userRights['TASK_SENSITIVE']
          ? f.oldReadonly
          : true
        : f.oldReadonly;
      if (isSense) {
        delete copyData[f.key];
      }
    });
    return copyData;
  };
  onChange = (newData, dispatch, props) => {
    console.log('afa1', this.props);
    let basicInfoFields = this.sensitiveParse(
      this.props.originData.t_account_profiles
    );
    //澳洲验证判断
    const hasType = basicInfoFields.find(el => {
      return el.key === 'certificateTypeGbg';
    });
    basicInfoFields = basicInfoFields.filter(el => {
      if (el.key.indexOf('Gbg') !== -1 && el.key !== 'certificateTypeGbg') {
        return newData.certificateTypeGbg
          ? typeMap[newData.certificateTypeGbg].includes(el.key)
          : !hasType
            ? true
            : false;
      } else {
        return true;
      }
    });
    this.props.changeAccountForm({
      ...this.props.originData,
      t_account_profiles: basicInfoFields
    });
  };
  render() {
    const { activeKey, accountInfoDataReady } = this.state;
    let {
      data,
      taskData,
      initialValues,
      accountDropdownData,
      passwordRegular,
      disabled,
      disabledData,
      taskId,
      getServerPasswordRegular,
      sameAccounts,
      getCtraderCurrencyByServerId,
      changeFormField,
      taskState,
      jobType,
      isAdaptOn,
      accountTypes
    } = this.props;
    // 没有匹配的mt服务器组不显示，包括MT组，杠杆，账户归属
    if (
      taskState !== VIEW_TYPE.FINISH &&
      !accountDropdownData.serverGroupsData
        .map(el => el.value)
        .find(el => el === initialValues.account.serverId)
    ) {
      initialValues.account.serverId = _.get(
        accountDropdownData.serverGroupsData,
        '[0].value',
        ''
      );
      initialValues.account.group = '';
      initialValues.account.leverage = '';
    }
    const { externalData = {} } = initialValues;
    const adptData = externalData.adapt || {};
    const basicInfoFields = this.sensitiveParse(data.t_account_profiles);
    console.log('initialValues.step1', basicInfoFields);
    let finacialFields = this.sensitiveParse(data.t_account_finacial);
    finacialFields.forEach(el => {
      el.type = el.key === 'bankAccount' ? 'edit' : undefined;
      el.placeHolder =
        el.key === 'bankAccount'
          ? i18n['withdraw.add_bank.tip']
          : el.placeHolder;
    });
    const idInfoFields = this.sensitiveParse(
      this.injectExistIdNumWarning(data.t_account_id_info)
    );
    const accountFields = this.sensitiveParse(data.t_account_account);
    // 真实账户开户, 账户信息是否可以编辑要通过任务设置中的是否允许修改判断 即 isEdit 字段
    let accountInfoDisabled = disabledData || disabled;
    if (
      taskData.jobType === 'JOB_TYPE_TA_OPEN' &&
      taskData.viewType === VIEW_TYPE.PROCESS
    ) {
      accountInfoDisabled = !taskData.isEdit;
    }
    return (
      <Tabs
        defaultActiveKey={this.defaultTabKey}
        onChange={this.toggleTab}
        id={ACCOUNT_FORM_BASIC_INFO}
        animated={false}
      >
        <Tab
          key={'1'}
          tab={i18n['task.details.user_account_info']}
          className={cs['tab-content']}
          forceRender
        >
          <h3 className={cs['form-title']}>
            {i18n['task.details.basic_info']}
          </h3>
          {sameAccounts && sameAccounts.length ? (
            <Form.Item col={1} className={cs['none-padding-form-item']}>
              <Form.Label>{i18n['task.details.same_accounts']}: </Form.Label>
              <Form.Control>
                <EllipsisContent className={cs['same-accounts']}>
                  {sameAccounts.join(', ')}
                </EllipsisContent>
              </Form.Control>
            </Form.Item>
          ) : (
            undefined
          )}
          <ReduxFormWraper
            reduxForm={BasicInfo}
            onSubmit={this.submit.bind(this, basicInfoFields)}
            onSubmitFail={this.submitFail}
            onChange={this.onChange}
            onSubmitSuccess={this.submitSuccess.bind(this, 'step1')}
            initialValues={initialValues.step1}
            fields={basicInfoFields}
            disabled={accountInfoDisabled}
          >
            <Form.Item col={2}>
              <Form.Label>{i18n['task.details.field.associated']}:</Form.Label>
              <Form.Control>
                <Input
                  type="text"
                  onChange={fn}
                  disabled={true}
                  value={externalData.customerName}
                />
              </Form.Control>
            </Form.Item>
          </ReduxFormWraper>
          <h3 className={cs['form-title']}>
            {i18n['task.details.financial_info']}
          </h3>
          <ReduxFormWraper
            reduxForm={FinacialInfo}
            onSubmit={this.submit.bind(this, finacialFields)}
            onSubmitFail={this.submitFail}
            onSubmitSuccess={this.submitSuccess.bind(this, 'step2')}
            initialValues={initialValues.step2}
            fields={finacialFields}
            disabled={accountInfoDisabled}
          />
          <h3 className={cs['form-title']}>
            {i18n['task.details.certificate_info']}
          </h3>
          <ReduxFormWraper
            reduxForm={IdInfo}
            asyncValidate={this.iDInfoValidate}
            onSubmit={this.submit.bind(this, idInfoFields)}
            onSubmitFail={this.submitFail}
            onChange={this.onIdInfoFormChange}
            onSubmitSuccess={this.submitSuccess.bind(this, 'step3')}
            initialValues={initialValues.step3}
            fields={idInfoFields}
            disabled={accountInfoDisabled}
          />

          {isAdaptOn && initialValues.customerId ? (
            <div>
              <h3 className={cs['form-title']}>
                {i18n['task.details.appropriateness_test_info']}
                {adptData.time ? (
                  <Link
                    className={cs['appropriateness-view-link']}
                    target="_blank"
                    to={`/adaptiveTest/${initialValues.customerId}/CUSTOMER`}
                  >
                    <i className={'fa fa-eye'} />{' '}
                    {i18n['appropriateness.view_detail']}
                  </Link>
                ) : (
                  undefined
                )}
              </h3>

              <Form className={cs['static-form-body']}>
                <Form.Item col={2}>
                  <Form.Label>{i18n['appropriateness.test_time']}:</Form.Label>
                  <Form.Control className={cs['form-text']}>
                    {adptData.time &&
                      moment(adptData.time).format(dateTimeFormatStyle)}
                  </Form.Control>
                </Form.Item>
                <Form.Item col={2}>
                  <Form.Label>{i18n['appropriateness.test_score']}:</Form.Label>
                  <Form.Control className={cs['form-text']}>
                    {typeof adptData.score !== 'undefined' ? (
                      <div>
                        {adptData.score}(
                        <FormattedMessage
                          id="appropriateness.total_score"
                          defaultMessage={i18n['appropriateness.total_score']}
                          values={{
                            score: adptData.totalScore || ''
                          }}
                        />
                        )
                      </div>
                    ) : (
                      undefined
                    )}
                  </Form.Control>
                </Form.Item>
                <Form.Item col={2}>
                  <Form.Label>
                    {i18n['appropriateness.test_result']}:
                  </Form.Label>
                  <Form.Control className={cs['form-text']}>
                    {adptData.result ? (
                      <div>
                        {i18n[`adaptive_test.item_title.${adptData.result}`]}
                        {', '}
                        {i18n['appropriateness.suggest_leverage']}:
                        {adptData.leverage ? (
                          <span>
                            {' 1:'}
                            {adptData.leverage}
                          </span>
                        ) : (
                          undefined
                        )}{' '}
                      </div>
                    ) : (
                      undefined
                    )}
                  </Form.Control>
                </Form.Item>
              </Form>
            </div>
          ) : (
            undefined
          )}
        </Tab>
        <Tab
          key={'2'}
          tab={i18n['task.details.account_info']}
          className={cs['tab-content']}
          forceRender
        >
          {accountInfoDataReady ? (
            <AccountInfo
              serverPlatform={initialValues.vendor.toLowerCase()}
              onSubmit={this.submit.bind(this, accountFields)}
              onSubmitFail={this.submitFail}
              onSubmitSuccess={this.submitSuccess.bind(this, 'account')}
              initialValues={Object.assign(
                {},
                data.t_account_account.reduce((obj, item) => {
                  if (typeof item.defaultValue !== 'undefined') {
                    obj[item.key] = item.defaultValue;
                  }
                  if (
                    item.key === 'leadSource' &&
                    !initialValues.account.leadSource &&
                    externalData.customSource
                  ) {
                    obj.leadSource = externalData.customSource;
                  }
                  const enableChangePasswordField = accountFields.find(
                    item => item.key === 'enableChangePassword'
                  );
                  if (
                    enableChangePasswordField &&
                    (enableChangePasswordField.required ||
                      _.get(
                        enableChangePasswordField,
                        'validateType.required',
                        false
                      ))
                  ) {
                    obj.enableChangePassword = '1';
                  }
                  if (obj.enableChangePassword === undefined) {
                    obj.enableChangePassword = '1'; //jimmy让处理
                  }
                  return obj;
                }, {}),
                initialValues.account || {},
                initialValues.extend || {} // ctrader显示traderid
              )}
              snapshot={initialValues.snapshot}
              taskData={taskData}
              fields={accountFields}
              accountDropdownData={accountDropdownData}
              disabled={disabled}
              externalData={externalData}
              taskId={taskId}
              passwordRegular={passwordRegular}
              getCtraderCurrencyByServerId={getCtraderCurrencyByServerId}
              getServerPasswordRegular={getServerPasswordRegular}
              changeFormField={changeFormField}
              isAdaptOn={isAdaptOn}
              accountTypes={accountTypes}
            />
          ) : (
            <div />
          )}
          {accountInfoDataReady && jobType === 'JOB_TYPE_TA_SAME_OPEN' ? (
            <Form>
              <Form.Item col={2}>
                <Form.Label>{i18n['task.details.field.comment']}:</Form.Label>
                <Form.Control className={cs['form-text']}>
                  <div className={cs['comment']} data-test="same-open-comment">
                    {initialValues.description}
                  </div>
                </Form.Control>
              </Form.Item>
            </Form>
          ) : (
            undefined
          )}
        </Tab>
      </Tabs>
    );
  }
}

const DropdownContainer = ({
  onSelect,
  name,
  disabled,
  options,
  input,
  searchable,
  meta: { touched, error },
  reminder
}) => {
  if (disabled) {
    input.onChange = fn;
  }
  return (
    <Form.Control error={touched && error ? error : null}>
      <DropdownForCode
        {...input}
        onChange={
          onSelect ? onSelect.bind(this, input.onChange) : input.onChange
        }
        disabled={disabled}
        data={options}
        searchable={searchable}
        defaultSelect
        className={`${cs['dropdown-width']} ${
          touched && error ? cs['error'] : ''
        }`}
      />
      {reminder ? <div>{reminder}</div> : undefined}
    </Form.Control>
  );
};

class IdInfoFormControl extends PureComponent {
  state = {
    existIdNumEntity: null,
    initSetTrue: false
  };
  componentWillReceiveProps({
    initialValues: { externalData: { existIdNumEntity = null } = {} } = {}
  }) {
    // 仅设置一次true，后续交给实时验证
    if (this.isIdNumExist(existIdNumEntity) && !this.state.initSetTrue) {
      this.setState({
        existIdNumEntity,
        initSetTrue: true
      });
    }
  }
  onFormParamChange = ({ idNum, idTypeIs5, idType, excludeCustomer } = {}) => {
    const { validateIdNum } = this.props;
    idTypeIs5
      ? validateIdNum(idNum, excludeCustomer).then(res => {
          this.setState({
            existIdNumEntity: res.data
          });
        })
      : this.setState({
          existIdNumEntity: null
        });
  };
  getExistReminder = input => {
    const { initialValues: { externalData = {} } = {} } = this.props;
    if (
      this.isIdNumExist(externalData.existIdNumEntity) &&
      !this.idNumSaticValidateFirstShow
    ) {
      return (
        <span className={cs['warning-value']}>
          {i18n['task.warning.info_exist']}
        </span>
      );
    }
  };

  isIdNumExist = existIdNumEntity => {
    if (!existIdNumEntity) {
      return false;
    }

    if (!Array.isArray(existIdNumEntity)) {
      return false;
    }

    if (existIdNumEntity.length === 0) {
      return false;
    }

    return true;
  };

  getExistIdNumHint = existIdNumEntity => {
    if (!this.isIdNumExist(existIdNumEntity)) {
      return;
    }

    return (
      <FormattedMessage
        id="task.warning.info_exist.details"
        defaultMessage={i18n['task.warning.info_exist.details']}
        values={{
          userName: existIdNumEntity[0].label,
          userNum: existIdNumEntity[0].entityNo
        }}
      />
    );
  };

  render() {
    const {
      input,
      disabled,
      placeholder,
      maxLength,
      initialValues: { externalData = {} } = {}
    } = this.props;
    const { existIdNumEntity } = this.state;

    return (
      <div>
        <Input
          {...input}
          disabled={disabled}
          placeholder={placeholder}
          maxLength={maxLength}
          type="text"
          title={disabled ? input.value : ''}
        />
        {!disabled &&
          this.isIdNumExist(existIdNumEntity) && (
            <div>
              <span className={cs['warning-value']}>
                {i18n['task.warning.info_exist']}
              </span>
              <Tooltip
                autoAdjustOverflow={false}
                placement="right"
                trigger="click"
                title={this.getExistIdNumHint(existIdNumEntity)}
              >
                <i className={`${cs['error-icon']} fa fa-exclamation-circle`} />
              </Tooltip>
            </div>
          )}
      </div>
    );
  }
}

// 基本信息 表单
const BasicInfo = reduxForm({
  form: ACCOUNT_FORM_BASIC_INFO,
  validate,
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
  shouldValidate: () => true
})(CustomField);

// 财务信息 表单
const FinacialInfo = reduxForm({
  form: ACCOUNT_FORM_FINACIAL_INFO,
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
  validate,
  shouldValidate: () => true
})(CustomField);

// 证件信息 表单
const IdInfo = reduxForm({
  form: ACCOUNT_FORM_ID_INFO,
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
  validate,
  shouldValidate: () => true
})(CustomField);

// 账户字段
const AccountLoginField = ({ input, disabled, meta: { touched, error } }) => {
  return (
    <Form.Control error={touched && error ? error : null}>
      <Input
        {...input}
        className={touched && error ? cs['error'] : ''}
        disabled={disabled}
        type="text"
      />
    </Form.Control>
  );
};

const defaultSelect = {
  label: i18n['general.default_select'],
  value: undefined
};
let accountAttributionValue = null;
const modifyAccountAttributionValue = (onChange, d) => {
  accountAttributionValue = d;
  onChange(d.id || '');
};
// 账户归属
const AccountAttribution = ({
  input,
  defaultValue,
  disabled,
  meta: { touched, error }
}) => {
  let { value, onChange, onBlur, ...inputProps } = input;
  if (disabled) {
    onChange = fn;
  }
  if (!accountAttributionValue && input.value && !touched) {
    accountAttributionValue = { value: input.value, label: defaultValue };
  }
  return (
    <Form.Control error={touched && error ? error : null}>
      <Dropdown
        {...inputProps}
        searchable={true}
        className={cs['dropdown-width']}
        value={accountAttributionValue}
        defaultSelect={defaultSelect}
        pipe={searchInputAjax}
        handleData={handleData}
        error={touched && error}
        disabled={disabled}
        onSelect={modifyAccountAttributionValue.bind(this, onBlur)}
        onBlur={modifyAccountAttributionValue.bind(this, onChange)}
      />
    </Form.Control>
  );
};

// 账户归属 即时搜索组件 ajax 函数
function searchInputAjax(v) {
  if (!v) {
    return Promise.resolve({
      result: true,
      data: {
        list: []
      }
    });
  }
  return post({
    url: '/v1/user/findSimpleByPage',
    data: {
      queryContent: v,
      queryType: 'NAME'
    }
  });
}

// 账户归属 即时搜索组件 ajax 数据处理
function handleData(res) {
  if (!res.result) return Promise.reject(false);
  const __d = res.data.list;
  const __data = __d.map(item => {
    let labelStr = item.name;
    const __strArr = [];
    if (item.roleName) __strArr.push(item.roleName);
    if (item.entityNo) __strArr.push(item.entityNo);
    if (__strArr.length > 0) {
      labelStr += ` (${__strArr.join('/')})`;
    }
    return {
      entityNo: item.entityNo,
      name: item.name,
      role: item.roleName,
      id: item.id,
      value: item.id,
      label: labelStr
    };
  });

  return Promise.resolve(__data);
}

function fn() {}

class AccountInfoComponent extends PureComponent {
  constructor(props) {
    super(props);
    const {
      initialValues: { serverId }
    } = props;
    this.state = {
      mtGroupOptios: this.getMtGroupOptions(serverId),
      serverId: serverId
    };
  }
  componentWillUnmount() {
    accountAttributionValue = null;
  }
  getServerPasswordRegular = id => {
    const { serverPlatform, getServerPasswordRegular } = this.props;
    return new Promise((resolve, reject) => {
      if (serverPlatform === 'mt5' && id) {
        getServerPasswordRegular(id, serverPlatform).then(() => {
          resolve();
        });
      } else {
        resolve();
      }
    });
  };
  getMtGroupOptions = id => {
    const {
      accountDropdownData: { serverGroupsData }
    } = this.props;
    const __current = serverGroupsData.find(item => item.value == id);
    let mtGroupOptios = __current ? __current.groups || [] : [];
    return mtGroupOptios.map(item => ({ label: item, value: item }));
  };
  serverChange = (onChange, e) => {
    const { change } = this.props;
    const v = e;
    const mtGroupOptios = this.getMtGroupOptions(v);
    this.setState({
      mtGroupOptios
    });
    if (!!v) {
      this.getServerPasswordRegular(v).then(() => {
        change('group', '');
        onChange(v);
      });
    } else {
      change('group', '');
      onChange(v);
    }
  };

  userIdFieldGenerator = () => {
    const { externalData, initialValues } = this.props;
    const { selectUser } = this.state;
    // const defaultValue =
    //   selectUser ||
    //   (externalData.accountAttributionName && {
    //     label: externalData.accountAttributionName,
    //     value: initialValues.userId.toString()
    //   });
    const defaultOptions = selectUser
      ? []
      : [
          {
            label: externalData.accountAttributionName,
            value: initialValues.userId.toString()
          }
        ];
    const defaultValue = selectUser || initialValues.userId.toString();
    return {
      key: 'userSelector',
      factory: (input, disabled, config) => {
        return (
          <UserSelector
            searchByField
            defaultSelect
            searchPlaceHolder={i18n['task.user_selector.search.placehoder']}
            className={cs['dropdown-width']}
            disabled={disabled}
            value={defaultValue}
            defaultOptions={defaultOptions}
            onSelect={value => {
              this.setState({
                selectUser: value
              });
              input.onChange(value.value);
            }}
          />
        );
      }
    };
  };
  serverIdFieldGenerator = () => {
    const { serverId } = this.state;
    return {
      key: 'serverSelector',
      factory: (input, disabled, config) => {
        return (
          <DropdownForCode
            defaultSelect
            className={cs['dropdown-width']}
            disabled={disabled}
            value={serverId}
            data={config.optionList}
            onChange={value => {
              this.onCtraderServerChange(value);
              input.onChange(value);
            }}
          />
        );
      }
    };
  };
  onCtraderServerChange = value => {
    const {
      getCtraderCurrencyByServerId,
      changeFormField,
      accountDropdownData
    } = this.props;
    const mtGroupOptios = this.getMtGroupOptions(value);
    if (value && !accountDropdownData.currencyData[value]) {
      getCtraderCurrencyByServerId(value);
    }
    changeFormField(ACCOUNT_FORM_ACCOUNT_INFO, 'group', '');
    changeFormField(ACCOUNT_FORM_ACCOUNT_INFO, 'currency', '');
    this.setState({
      serverId: value,
      mtGroupOptios
    });
  };
  cTraderFormChange = data => {
    const { serverId } = this.state;
    if (data.serverId !== serverId) {
      this.onCtraderServerChange(data.serverId);
    }
  };
  formatCustomerField = () => {
    const {
      fields,
      accountDropdownData,
      externalData,
      initialValues,
      serverPlatform,
      vendor
    } = this.props;
    const status = {
      component: {
        regdate: {
          key: 'date',
          factory: (input, disabled, config) => {
            return (
              <Input
                disabled={true}
                className={cs['dropdown-width']}
                value={
                  initialValues.regdate
                    ? moment(new Date(initialValues.regdate)).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''
                }
                type="text"
              />
            );
          }
        }
      }
    };
    const _fields = fields.map(item => {
      const result = Object.assign({}, item);
      for (let key in status) {
        if (status[key][item.key]) {
          result[key] = status[key][item.key];
        }
      }
      return result;
    });
    return _fields;
  };
  formatCTraderField = () => {
    const { mtGroupOptios, serverId } = this.state;
    const serverIdField = {
      label: i18n['task.create_account.account_info.server_owner'],
      fieldType: 'select',
      key: 'serverId',
      validateType: {},
      columns: 1
    };
    // const traderIdField = {
    //   label: i18n['task.create_account.account_info.ctrader_id'],
    //   fieldType: 'text',
    //   key: 'ctid',
    //   validateType: {},
    //   columns: 1
    // };
    const {
      fields,
      accountDropdownData,
      externalData,
      initialValues,
      serverPlatform,
      isAdaptOn
    } = this.props;
    const status = {
      optionList: {
        group: mtGroupOptios,
        userGroup: accountDropdownData.userGroupsData,
        currency: accountDropdownData.currencyData[serverId],
        serverId: accountDropdownData.serverGroupsData
      },
      fieldType: {
        userId: 'userSelector',
        serverId: 'serverSelector'
      },
      validateType: { serverId: { required: true } },
      component: {
        userId: this.userIdFieldGenerator(),
        serverId: this.serverIdFieldGenerator(),
        regdate: {
          key: 'date',
          factory: (input, disabled, config) => {
            return (
              <Input
                disabled={true}
                className={cs['dropdown-width']}
                value={
                  initialValues.regdate
                    ? moment(new Date(initialValues.regdate)).format(
                        'YYYY-MM-DD HH:mm:ss'
                      )
                    : ''
                }
                type="text"
              />
            );
          }
        }
      },
      reminder: {
        leverage:
          isAdaptOn && externalData.adapt && externalData.adapt.leverage ? (
            <div className={cs['form-notice']}>
              {i18n['appropriateness.according_to_the_test_results']}:{' '}
              {i18n['appropriateness.suggest_leverage']}
              {' 1:'}
              {externalData.adapt.leverage}
            </div>
          ) : (
            undefined
          )
      }
    };
    const copyData = [serverIdField, ...fields];
    const _fields = copyData.map(item => {
      const result = Object.assign({}, item);
      for (let key in status) {
        if (status[key][item.key]) {
          result[key] = status[key][item.key];
        }
      }
      return result;
    });
    return _fields;
  };
  render() {
    const { mtGroupOptios } = this.state;
    const {
      fields,
      accountDropdownData,
      disabled,
      externalData,
      serverPlatform,
      initialValues,
      snapshot,
      taskData,
      isAdaptOn,
      accountTypes
    } = this.props;
    const isFinished = taskData.viewType === VIEW_TYPE.FINISH;
    let __fields = fields;
    if (serverPlatform === 'ctrader') {
      __fields = this.formatCTraderField();
      //不是mt4 mt5的话 不要写死的children
      return (
        <CustomField
          fields={__fields}
          disabled={disabled}
          size="large"
          onChange={this.cTraderFormChange}
        />
      );
    }
    // if (!_.find(mtGroupOptios, { value: initialValues.group })) {
    //   const val = _.get(mtGroupOptios, '[0].value', '');
    //   initialValues.group = val;
    // }
    __fields = this.formatCustomerField();
    return (
      <CustomField fields={__fields} disabled={disabled}>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.customSource']}: </Form.Label>
          <Form.Control>
            <Input
              className="form-control"
              value={externalData.customSource}
              disabled={true}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.account']}: </Form.Label>
          <Field
            name="login"
            component={AccountLoginField}
            disabled={disabled}
          />
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label required={true}>
            {i18n['task.details.field.server_group']}:{' '}
          </Form.Label>
          {isFinished && snapshot ? (
            <Form.Control>
              <Input
                disabled={true}
                value={snapshot.serverIdName}
                type="text"
              />
            </Form.Control>
          ) : (
            <Field
              component={DropdownContainer}
              name="serverId"
              onSelect={this.serverChange}
              options={accountDropdownData.serverGroupsData}
              disabled={disabled}
            />
          )}
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label required={true}>
            {i18n['task.details.field.mt_group']}:{' '}
          </Form.Label>
          {disabled ? (
            <Form.Control>
              <Input disabled={true} value={initialValues.group} type="text" />
            </Form.Control>
          ) : (
            <Field
              component={DropdownContainer}
              searchable
              name="group"
              options={mtGroupOptios}
              disabled={disabled}
            />
          )}
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>{i18n['task.details.field.account_group']}: </Form.Label>
          {isFinished && snapshot ? (
            <Form.Control>
              <Input
                disabled={true}
                value={snapshot.userGroupName}
                type="text"
              />
            </Form.Control>
          ) : (
            <Field
              component={DropdownContainer}
              name="userGroup"
              searchable
              options={accountDropdownData.userGroupsData}
              disabled={disabled}
            />
          )}
        </Form.Item>
        <Form.Item col={2}>
          <Form.Label>
            {i18n['task.details.field.account_attribution']}:{' '}
          </Form.Label>
          <Field
            component={AccountAttribution}
            defaultValue={externalData.accountAttributionName}
            name="userId"
            disabled={disabled}
          />
        </Form.Item>

        <Form.Item col={2}>
          <Form.Label required={true}>
            {i18n['task.details.field.leverage']}:{' '}
          </Form.Label>
          {isFinished && snapshot ? (
            <Form.Control>
              <Input
                disabled={true}
                value={snapshot.leverageName}
                type="text"
              />
            </Form.Control>
          ) : (
            <Field
              component={DropdownContainer}
              name="leverage"
              reminder={
                isAdaptOn &&
                externalData.adapt &&
                externalData.adapt.leverage ? (
                  <div className={cs['form-notice']}>
                    {i18n['appropriateness.according_to_the_test_results']}:{' '}
                    {i18n['appropriateness.suggest_leverage']}
                    {' 1:'}
                    {externalData.adapt.leverage}
                  </div>
                ) : (
                  undefined
                )
              }
              options={accountDropdownData.leverageData}
              disabled={disabled}
            />
          )}
        </Form.Item>
      </CustomField>
    );
  }
}

// 账户信息 表单
const AccountInfo = reduxForm({
  form: ACCOUNT_FORM_ACCOUNT_INFO,
  onSubmitFail: errors => {
    setTimeout(() => {
      document.querySelectorAll('[class*=error]')[0].focus();
    }, 0);
  },
  validate: function(values, props) {
    const { serverPlatform, passwordRegular } = props;
    const customeErrors = validate(values, props);
    const errors = {};
    // 检测必填checkbox是否已选
    props.fields &&
      Object.keys(values).map(key => {
        const _value = values[key];
        const _field = props.fields.find(item => item.key === key);
        if (
          _field &&
          _field.fieldType === 'singleCheckbox' &&
          _field.validateType &&
          _field.validateType.required &&
          Number(_value) === 0
        ) {
          errors[key] = i18n['custom_field.checkbox_required'];
        }
      });
    if (serverPlatform === 'ctrader') {
      if (
        values.leverage &&
        values.maxLeverage &&
        values.leverage > values.maxLeverage
      ) {
        errors.maxLeverage =
          i18n['task.object_setting.save.invaild_max_leverage'];
      }
      // 服务器组必填验证
      if (!isRequired(values.serverId)) {
        errors['serverId'] = (
          <FormattedMessage
            id="custom_field.required"
            defaultMessage={i18n['custom_field.required']}
            values={{ value: i18n['task.details.field.server_group'] }}
          />
        );
      }
      return Object.assign({}, customeErrors, errors);
    }
    // 账户数字验证
    if (!!values.login && !isNumber(values.login)) {
      errors['login'] = (
        <FormattedMessage
          id="custom_field.number"
          defaultMessage={i18n['custom_field.number']}
          values={{ value: i18n['task.details.field.account'] }}
        />
      );
    }
    // 服务器组必填验证
    if (!isRequired(values.serverId)) {
      errors['serverId'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['task.details.field.server_group'] }}
        />
      );
    }
    // 杠杆必填验证
    if (!isRequired(values.leverage)) {
      errors['leverage'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['task.details.field.leverage'] }}
        />
      );
    }
    // MT组必填验证
    if (!isRequired(values.group)) {
      errors['group'] = (
        <FormattedMessage
          id="custom_field.required"
          defaultMessage={i18n['custom_field.required']}
          values={{ value: i18n['task.details.field.mt_group'] }}
        />
      );
    }
    // mt5服务器组时 主密码, 投资密码格式验证
    if (serverPlatform === 'mt5' && values.serverId) {
      // erros['password']
      const { reg, minLength } = passwordRegular[values.group] || {};
      ['password', 'investorPassword'].forEach(item => {
        if (!values[item] || values[item].match(reg)) return;
        errors[item] = (
          <FormattedMessage
            id="custom_field.min_number"
            defaultMessage={i18n['custom_field.min_number']}
            values={{ value: minLength }}
          />
        );
      });
    }
    return Object.assign({}, customeErrors, errors);
  },
  asyncValidate: (values, dispatch, props) => {
    if (!values.login) return Promise.resolve();
    const { taskId } = props;
    //账号查重
    return post({
      url: `/v1/tasks/job/${taskId}/${values.login}/check`
    }).then(({ result, data }) => {
      if (data) {
        throw { login: i18n['task.details.warning.account_duplicate_tips'] };
      }
    });
  },
  enableReinitialize: true,
  asyncBlurFields: ['login']
})(AccountInfoComponent);

function getLabelOfListItem(list, value) {
  if (!list) return;
  const matched = list.find(item => item.value == value);
  return matched && matched.label;
}
