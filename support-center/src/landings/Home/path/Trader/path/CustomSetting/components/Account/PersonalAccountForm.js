import { Field, formValueSelector, reduxForm } from 'redux-form';
import Form from 'components/Form';
import cs from './Form.less';
import i18n from 'utils/i18n';
import FormField from 'components/FormField';
import { required } from 'components/FormField/validate';
import SameAccount from '../../../../components/BasicInfo/SameAccount';
import Tab from 'components/Tab';
import { connect } from 'react-redux';

export const TRADER_CUSTOM_ACCOUNT_FORM = 'TRADER_CUSTOM_ACCOUNT_FORM';

export const ACCOUNT_NAME_FIELD_PREFIX = 'accountName_';
export const ACCOUNT_DESC_FIELD_PREFIX = 'accountDesc_';

class CForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = { activeLanguageKey: 'zh-CN' };
  }

  onChangeLanguageTab = key => {
    this.setState({
      activeLanguageKey: key
    });
  };

  render() {
    const { languages = [], allowSameAccount, enablePersonalAccount } = this.props;
    return (
      <Form showHelpText className={cs.account_setting}>
        <Form.Item>
          <Form.Label />
          <Form.Control className={cs.switch_style}>
            <span className={cs.switch_label}>{i18n[`trader.customSetting.form.usePersonalAccount`]}</span>
            <Field name="enablePersonalAccount" fieldType="switch" component={FormField} />
          </Form.Control>
        </Form.Item>
        <Tab className={cs['tab']} activeKey={this.state.activeLanguageKey} onChange={this.onChangeLanguageTab}>
          {languages.map(el => {
            return (
              <Tab.Panel title={el.label} eventKey={el.value} className={cs['tab_content']}>
                <Form.Item>
                  <span>{i18n['trader.customSetting.form.accountName']}：</span>
                  <Form.Control>
                    <Field
                      name={`${ACCOUNT_NAME_FIELD_PREFIX}${el.value}`}
                      label={i18n['trader.customSetting.form.accountName']}
                      fieldType="text"
                      maxLength={50}
                      component={FormField}
                      disabled={!enablePersonalAccount}
                    />
                  </Form.Control>
                </Form.Item>
                <Form.Item>
                  <span>{i18n['trader.customSetting.form.accountIntroduce']}：</span>
                  <Form.Control>
                    <Field
                      name={`${ACCOUNT_DESC_FIELD_PREFIX}${el.value}`}
                      label={i18n['trader.customSetting.form.accountIntroduce']}
                      fieldType="textarea"
                      maxLength={200}
                      rows={10}
                      component={FormField}
                      disabled={!enablePersonalAccount}
                    />
                  </Form.Control>
                </Form.Item>
              </Tab.Panel>
            );
          })}
        </Tab>
        <Form.Item>
          <Form.Label />
          <Form.Control className={cs.allowed_check_box}>
            <Field
              label={i18n['trader.customSetting.form.allowApplyPersonalAccount']}
              name="allowPersonalAccount"
              fieldType="checkbox"
              component={FormField}
              disabled={!enablePersonalAccount}
            />
            <SameAccount allowSameAccount={allowSameAccount} disabled={!enablePersonalAccount} />
            <Field
              label={i18n['trader.plat.setting.basicInfo.start_income_online']}
              name="enableOnlineDeposit"
              fieldType="checkbox"
              component={FormField}
              disabled={!enablePersonalAccount}
            />
            <Field
              label={i18n['trader.plat.setting.basicInfo.apply_telegraphicTransfer_info']}
              name="provideTelegraphic"
              fieldType="checkbox"
              component={FormField}
              disabled={!enablePersonalAccount}
            />
            <Field
              label={i18n['trader.plat.setting.basicInfo.start_withdraw_online']}
              name="enableOnlineWithdraw"
              fieldType="checkbox"
              component={FormField}
              disabled={!enablePersonalAccount}
            />
            <Field
              label={i18n['trader.plat.setting.basicInfo.start_transfer_online']}
              name="enableOnlineTransfer"
              fieldType="checkbox"
              component={FormField}
              disabled={!enablePersonalAccount}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}

let RForm = reduxForm({
  form: TRADER_CUSTOM_ACCOUNT_FORM,
  enableReinitialize: true
})(CForm);

const selector = formValueSelector(TRADER_CUSTOM_ACCOUNT_FORM); // <-- same as form name

export const PersonalAccountForm = connect(
  state => {
    const allowSameAccount = selector(state, 'allowSameAccount');
    const enablePersonalAccount = selector(state, 'enablePersonalAccount');
    return {
      allowSameAccount,
      enablePersonalAccount
    };
  },
  {}
)(RForm);
