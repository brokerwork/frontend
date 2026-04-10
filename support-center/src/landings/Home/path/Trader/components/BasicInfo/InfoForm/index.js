import { Field } from 'redux-form';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import { default as FormField } from 'components/FormField';
import { required } from 'components/FormField/validate';
import cs from './index.less';
import SameAccount from '../SameAccount';
import Tips from 'components/Tips';

export default class BasicInfoForm extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLeverageDisabled: false
    };
  }
  componentDidMount() {
    const {
      initialValues: { allowChangeLeverage }
    } = this.props;
    if (!allowChangeLeverage) {
      this.state = {
        isLeverageDisabled: true
      };
    }
  }
  onChange = value => {
    this.setState({
      isLeverageDisabled: !value
    });
  };
  render() {
    const { leverageList, allowSameAccount, allowRealAccount, plat } = this.props;
    const { isLeverageDisabled } = this.state;
    return (
      <div className={cs['form_container']}>
        <Form showHelpText>
          <Form.Item>
            <Form.Label>{i18n['trader.plat.setting.basicInfo.status']}：</Form.Label>
            <Form.Control className={cs['rem-group']}>
              <Field label={i18n['general.start']} name="enabled" fieldType="checkbox" component={FormField} />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>
              <span className="required" />
              {i18n['trader.plat.setting.basicInfo.name']}：
            </Form.Label>
            <Form.Control>
              <Field
                name="structuralName"
                label={i18n['trader.plat.setting.basicInfo.name']}
                fieldType="text"
                maxLength={50}
                component={FormField}
                validate={required}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>
              {i18n['trader.plat.setting.basicInfo.logo']}
              <Tips className={cs.tips} align="top">
                {i18n['trader.plat.setting.basicInfo.logo_tips']}
              </Tips>
              ：
            </Form.Label>
            <Form.Control>
              <Field name="structuralLogo" fieldType="file" onlyImage component={FormField} />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label>{i18n['trader.plat.setting.basicInfo.introduce']}：</Form.Label>
            <Form.Control>
              <Field
                name="description"
                label={i18n['trader.plat.setting.basicInfo.introduce']}
                fieldType="textarea"
                maxLength={50}
                rows={10}
                component={FormField}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item>
            <Form.Label />
            <Form.Control className={cs.allowed_check_box}>
              <Field
                label={i18n['trader.plat.setting.basicInfo.allowed_apply_real_account']}
                name="allowRealAccount"
                fieldType="checkbox"
                component={FormField}
              />
              {plat !== 'CTRADER' && (
                <div className={cs.condition_label}>
                  <label className={cs.label_title}>
                    {i18n['trader.plat.setting.basicInfo.allowed_apply_real_account.condition_label']}
                  </label>
                  <Field
                    name="allowBeforeDemo"
                    fieldType="radio"
                    component={FormField}
                    disabled={!allowRealAccount}
                    options={[
                      {
                        value: false,
                        label: i18n['trader.plat.setting.basicInfo.allowed_apply_real_account.no_condition']
                      },
                      {
                        value: true,
                        label: i18n['trader.plat.setting.basicInfo.allowed_apply_real_account.virtual_account']
                      }
                    ]}
                  />
                </div>
              )}
              <SameAccount allowSameAccount={allowSameAccount} />
              <Field
                label={i18n['trader.plat.setting.basicInfo.allowed_bind_real_account']}
                name="allowBindAccount"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.allowed_regist_virtual_account']}
                name="allowDemoAccount"
                fieldType="checkbox"
                component={FormField}
              />
              <div>
                <Field
                  label={i18n['trader.plat.setting.basicInfo.allowed_adjust_leverage']}
                  name="allowChangeLeverage"
                  fieldType="checkbox"
                  component={FormField}
                  onFieldChange={this.onChange}
                />
                <div className={cs.leverage_select}>
                  <label>{i18n['trader.plat.setting.basicInfo.choosable_leverage']}</label>
                  <Field
                    className={cs.select_field_ss}
                    label={i18n['trader.plat.setting.basicInfo.allowed_adjust_leverage']}
                    name="leverages"
                    fieldType="multiSelect"
                    component={FormField}
                    options={leverageList}
                    disabled={isLeverageDisabled}
                  />
                </div>
              </div>
              <Field
                label={i18n['trader.plat.setting.basicInfo.start_income_online']}
                name="enableOnlineDeposit"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.apply_telegraphicTransfer_info']}
                name="provideTelegraphic"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.start_withdraw_online']}
                name="enableOnlineWithdraw"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.start_transfer_online']}
                name="enableOnlineTransfer"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.allowed_see_position']}
                name="allowViewPosition"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.allowed_see_order']}
                name="allowViewOrder"
                fieldType="checkbox"
                component={FormField}
              />
              <Field
                label={i18n['trader.plat.setting.basicInfo.allowed_see_history']}
                name="allowViewHistoryOrder"
                fieldType="checkbox"
                component={FormField}
              />
            </Form.Control>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
