import CustomField, { validate } from 'components/v2/CustomField';
import { reduxForm, Field } from 'redux-form';
import i18n from 'utils/i18n';
import cs from './CreateModal.less';
import UserSelector from 'components/v2/UserSelector';
import { FormattedMessage } from 'react-intl';
import { get } from 'utils/ajax';
import { Input, Form } from 'lean-ui';
import { citdField } from 'utils/ctidConstant';
import _ from 'lodash';
import { isEmail } from 'utils/validate';
import { renderField, required } from 'utils/v2/renderField';
import { getType } from 'utils/language';
export const ACCOUNT_INFO_FORM = 'ACCOUNT_LIST_ACCOUNT_INFO_FORM';

const loginNormalize = (value, prevValue) => {
  return parseInt(value);
};

class AccountInfoForm extends PureComponent {
  accountTypesOpts = null;
  componentDidMount() {
    const { change } = this.props;
    const currentType = _.get(this.accountTypesOpts, '[0].value', 'Individual');
    change('accountInfo-customAccountType', currentType);
  }
  fieldGenerator = () => {
    return {
      key: 'userSelector',
      factory: (input, disabled) => {
        let v = input.value;
        let data = [];
        if (typeof v === 'object' && v.value !== undefined) {
          data = [v];
          v = v.label;
        }
        return (
          <UserSelector
            className={cs['user-selector']}
            searchByField
            searchPlaceHolder={i18n['account.user_selector.search.placehoder']}
            disabled={disabled}
            value={v}
            originValue={data}
            onSelect={input.onChange}
          />
        );
      }
    };
  };

  _renderHeader = () => {
    const { relatedAccounts } = this.props;

    return (
      <div className={cs['panelHeader']}>
        {i18n['account.edit_account_owner_info.title']}{' '}
        {relatedAccounts.length !== 0 && (
          <span className={cs['relate-account']}>
            <FormattedMessage
              id="account.edit_account_owner_info.related_account"
              defaultMessage={
                i18n['account.edit_account_owner_info.related_account']
              }
              values={{
                list: (
                  <span>
                    {relatedAccounts
                      .map(item => item.account)
                      .join(i18n['general.dot'])}
                  </span>
                )
              }}
            />
          </span>
        )}
      </div>
    );
  };

  render() {
    const {
      columns,
      currentServer,
      setDefaultValue,
      accountTypes,
      versionRights
    } = this.props;
    const { vendor } = currentServer;
    const haveCtid = _.chain(columns)
      .get('accountInfo', [])
      .find({
        key: 'accountInfo-ctid'
      })
      .value();
    if (vendor === 'CTRADER' && !haveCtid) {
      columns.accountInfo.push(citdField);
    }
    if (!this.accountTypesOpts) {
      let accountTypesOpts = accountTypes[vendor];
      this.accountTypesOpts = accountTypesOpts;
    }
    const { accountTypesOpts } = this;
    return (
      <div>
        <div className={cs['content-one']}>
          {this._renderHeader()}
          {accountTypesOpts.length &&
          versionRights['SC_CUSTOM_ACCOUNT_TYPE'] ? (
            <div
              style={accountTypesOpts.length === 1 ? { display: 'none' } : {}}
            >
              <CustomField fields={[]}>
                <Form.Item col={2}>
                  <Form.Label>
                    {`${
                      i18n[
                        'account.create_account.account_info.custom_account_type'
                      ]
                    }:`}
                  </Form.Label>
                  <Form.Control>
                    <Field
                      name="accountInfo-customAccountType"
                      component={renderField}
                      type="radioField"
                      radioList={accountTypesOpts}
                    />
                  </Form.Control>
                </Form.Item>
              </CustomField>
            </div>
          ) : null}
          {columns.customerInfo.length && (
            <CustomField
              setDefaultValue={setDefaultValue}
              fields={columns.customerInfo}
            />
          )}
          {columns.baseInfo.length && (
            <div>
              <h3 className={cs['heading']}>
                {i18n['account.edit_account.tabs.basic_info']}
              </h3>
              <CustomField
                setDefaultValue={setDefaultValue}
                fields={columns.baseInfo}
              />
            </div>
          )}
          {columns.financialInfo.length && (
            <div>
              <h3 className={cs['heading']}>
                {i18n['account.edit_account.tabs.financial_info']}
              </h3>
              <CustomField
                setDefaultValue={setDefaultValue}
                fields={columns.financialInfo}
              />
            </div>
          )}
          {columns.certificatesInfo.length && (
            <div>
              <h3 className={cs['heading']}>
                {i18n['account.edit_account.tabs.certificate_info']}
              </h3>
              <CustomField
                setDefaultValue={setDefaultValue}
                fields={columns.certificatesInfo}
              />
            </div>
          )}
        </div>
        <div className={`${cs['cardContent']} ${cs['content-two']}`}>
          <h3 className={cs['heading']}>
            {i18n['account.create_account.account_info.title']}
          </h3>
          {columns.accountInfo.length && (
            <CustomField
              setDefaultValue={setDefaultValue}
              fields={columns.accountInfo}
              fieldGenerator={this.fieldGenerator()}
            >
              <Form.Item col={2}>
                <Form.Label>
                  {i18n['account.create_account.account_info.server_owner']}
                </Form.Label>
                <Form.Control>
                  <Input value={currentServer.label} disabled />
                </Form.Control>
              </Form.Item>
            </CustomField>
          )}
        </div>
      </div>
    );
  }
}

export default reduxForm({
  form: ACCOUNT_INFO_FORM,
  enableReinitialize: true,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document
        .querySelectorAll('[class*=error]')[0]
        .querySelector('input');
      errorDom
        ? errorDom.focus()
        : document.querySelectorAll('input[class*=error]')[0].focus();
    }, 0);
  },
  validate: (values = {}, props) => {
    const {
      currentServer: { vendor },
      passwordRegular,
      accountRange,
      requiredCheckboxs
    } = props;
    const customeErrors = validate(values, props);
    const errors = {};
    // mt5服务器组时 主密码, 投资密码格式验证
    if (vendor === 'MT5') {
      // erros['password']
      const { reg, minLength } =
        passwordRegular[values['accountInfo-group']] || {};
      ['accountInfo-password', 'accountInfo-investorPassword'].forEach(item => {
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

    if (vendor === 'CTRADER') {
      if (values['accountInfo-leverage'] && values['accountInfo-maxLeverage']) {
        if (
          parseFloat(values['accountInfo-leverage']) >
          parseFloat(values['accountInfo-maxLeverage'])
        ) {
          errors['accountInfo-leverage'] =
            i18n['account.cbroker.leverage.max_error_tips'];
        }
      }
      if (values['accountInfo-ctid'] && !isEmail(values['accountInfo-ctid'])) {
        errors['accountInfo-ctid'] = i18n['account.cbroker.ctid.error_tips'];
      }
    }

    if (vendor !== 'CTRADER') {
      if (values['accountInfo-login']) {
        if (parseInt(values['accountInfo-login'][0]) === 0) {
          errors['accountInfo-login'] = i18n['account.create.login_rule_error'];
        } else {
          if (
            (accountRange.beginNo &&
              parseInt(values['accountInfo-login']) < accountRange.beginNo) ||
            (accountRange.endNo &&
              parseInt(values['accountInfo-login']) > accountRange.endNo)
          ) {
            errors['accountInfo-login'] =
              i18n['account.create.login_range_error'];
          }
        }
      }
    }
    Object.keys(values).map(key => {
      const _value = values[key];
      if (requiredCheckboxs.includes(key) && Number(_value) === 0) {
        errors[key] = i18n['custom_field.checkbox_required'];
      }
    });
    return { ...customeErrors, ...errors };
  },
  asyncValidate: (values = {}, dispatch, props) => {
    if (!values['accountInfo-login']) return Promise.resolve({});

    const {
      currentServer: { vendor, serverId }
    } = props;

    return get({
      url: `/v1/account/manage/checkAccountExist/${
        values['accountInfo-login']
      }`,
      header: {
        'x-api-vendor': vendor,
        'x-api-serverid': serverId
      }
    }).then(({ result, data }) => {
      if (data) {
        throw {
          'accountInfo-login':
            i18n['account.create_account.account_info.account_duplicate_tips']
        };
      }
    });
  },
  asyncBlurFields: ['accountInfo-login']
})(AccountInfoForm);
