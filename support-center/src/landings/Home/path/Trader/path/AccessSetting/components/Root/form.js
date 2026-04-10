import { reduxForm, Field, formValueSelector, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import FormField from 'components/FormField';
import Form from 'components/Form';
import Button from 'components/Button';
import i18n from 'utils/i18n';
import Tips from 'components/Tips';
import cs from './style.less';
import DoubleValidate from '../DoubleValidate';

export const ACCESS_SETTING_FORM = 'TW_ACCESS_SETTING_FORM';

class AccessSettingForm extends PureComponent {
  componentRecieveProps(nextProps) {
    const { registrable: nextRegistrable } = nextProps;
    const { registrable, doServiceSetting } = this.props;
    if (registrable !== nextRegistrable && nextRegistrable === false) {
      doServiceSetting();
    }
  }
  render() {
    const { registrable, initialValues, twoFAConfig, versionRights = [] } = this.props;
    return (
      <Form>
        <div className="registrable">
          <Form.Item>
            <Form.Label>{i18n['access.setting.regist.way']}：</Form.Label>
            <Form.Control>
              <Field
                name="registrable"
                fieldType="radio"
                options={[
                  { label: i18n['access.setting.regist.way.open'], value: true },
                  { label: i18n['access.setting.regist.way.close'], value: false }
                ]}
                component={FormField}
              />
            </Form.Control>
            <Form.HelpText>（{i18n['access.setting.regist.way.message']}）</Form.HelpText>
          </Form.Item>
          {registrable
            ? [
                <Form.Item>
                  <Form.Label />
                  <Form.Control>
                    <Field
                      name="allowEmail"
                      fieldType="checkbox"
                      component={FormField}
                      label={i18n['access.setting.regist.way.email']}
                    />
                    <Field
                      name="defaultRegisterMethod"
                      fieldType="radio"
                      options={[{ label: i18n['access.setting.regist.way.default.show'], value: 'email' }]}
                      component={FormField}
                    />
                  </Form.Control>
                </Form.Item>,
                <Form.Item>
                  <Form.Label />
                  <Form.Control>
                    <Field
                      name="allowPhone"
                      fieldType="checkbox"
                      component={FormField}
                      label={i18n['access.setting.regist.way.mob']}
                    />
                    <Field
                      name="defaultRegisterMethod"
                      fieldType="radio"
                      options={[{ label: i18n['access.setting.regist.way.default.show'], value: 'phone' }]}
                      component={FormField}
                    />
                  </Form.Control>
                </Form.Item>,
                // <Form.Item>
                //   <Form.Label />
                //   <Form.Control>
                //     <Field name="registerMethod" component={FormField} />
                //   </Form.Control>
                // </Form.Item>
              ]
            : null}
        </div>
        <Form.Item>
          <Form.Label>{i18n['trader.registerOnly']}：</Form.Label>
          <Form.Control>
            <Field
              name="registerOnly"
              fieldType="radio"
              options={[
                { label: i18n['general.visible'], value: true },
                { label: i18n['general.hidden'], value: false }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['access.setting.express.lane']}：</Form.Label>
          <Form.Control>
            <Field
              name="proxyRegisterable"
              fieldType="checkbox"
              component={FormField}
              label={i18n['access.setting.express.lane.apply.agent']}
            />
            <Field
              name="registWithOpenAccount"
              fieldType="checkbox"
              component={FormField}
              disabled={!registrable}
              label={i18n['access.setting.express.lane.register.open']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['access.setting.slide.verify']}：</Form.Label>
          <Form.Control>
            <Field
              name="emailSlideVerify"
              fieldType="checkbox"
              component={FormField}
              label={i18n['access.setting.slide.verify.email']}
            />
            <Field
              name="phoneSlideVerify"
              fieldType="checkbox"
              component={FormField}
              label={i18n['access.setting.slide.verify.phone']}
            />
            <Field
              name="forgetPwdSlideVerify"
              fieldType="checkbox"
              component={FormField}
              label={i18n['access.setting.slide.verify.forget.password']}
            />
          </Form.Control>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['access.setting.captcha']}：</Form.Label>
          <Form.Control>
            <Field name="verificationLoginFailTimes" fieldType="number" component={FormField} />
          </Form.Control>
          <Form.HelpText>
            {i18n['access.setting.times.unit']}
            <span className="tips">{i18n['access.setting.captcha.tips']}</span>
          </Form.HelpText>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['access.setting.account.lock']}：</Form.Label>
          <Form.Control>
            <Field name="lockLoginFailTimes" fieldType="number" component={FormField} />
          </Form.Control>
          <Form.HelpText>
            {i18n['access.setting.times.unit']}
            <span className="tips">{i18n['access.setting.account.lock.tips']}</span>
          </Form.HelpText>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['access.setting.logout.timeout.tw']}：</Form.Label>
          <Form.Control>
            <Field name="logoutTime" fieldType="number" component={FormField} />
          </Form.Control>
          <Form.HelpText>
            {i18n['access.setting.minute.unit']}
            <span className="tips">{i18n['access.setting.logout.timeout.tips']}</span>
          </Form.HelpText>
        </Form.Item>
        <Form.Item>
          <Form.Label>{i18n['access.setting.logout.timeout.app']}：</Form.Label>
          <Form.Control>
            <Field name="appLogoutTime" fieldType="number" component={FormField} />
          </Form.Control>
          <Form.HelpText>
            {i18n['access.setting.minute.unit.hour']}
            <span className="tips">{i18n['access.setting.logout.hours.tips']}</span>
          </Form.HelpText>
        </Form.Item>
        <Form.Item className="pwd-strong">
          <Form.Label>{i18n['access.setting.password.strength']}：</Form.Label>
          <Form.Control>
            <Field
              name="pwdStrength"
              fieldType="radio"
              options={[
                { label: i18n['access.setting.password.middle'], value: 'Middle' },
                { label: i18n['access.setting.password.strong'], value: 'Strong' },
                { label: i18n['access.setting.password.super'], value: 'SuperStrong' }
              ]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
        {versionRights['SC_SECURITY_SET'] ? (
          <Form.Item>
            <Form.Label>
              {i18n['broker.access_setting.double_validate']}
              <Tips className={cs.tips} align="top">
                {i18n['broker.access_setting.double_validate.tips']}
              </Tips>
              ：
            </Form.Label>
            <Form.Control>
              <FormSection name="twoFAConfig">
                <DoubleValidate initialValues={initialValues} twoFAConfig={twoFAConfig} />
              </FormSection>
            </Form.Control>
          </Form.Item>
        ) : null}
        <Form.Item>
          <Form.Label>{i18n['broker.access_setting.is_show_flag']}：</Form.Label>
          <Form.Control>
            <Field
              name="showFlag"
              fieldType="radio"
              options={[{ label: i18n['general.yes'], value: true }, { label: i18n['general.no'], value: false }]}
              component={FormField}
            />
          </Form.Control>
        </Form.Item>
      </Form>
    );
  }
}
const AccessFormRedux = reduxForm({
  form: ACCESS_SETTING_FORM,
  enableReinitialize: true
})(AccessSettingForm);

const selector = formValueSelector(ACCESS_SETTING_FORM);
export default connect(
  state => {
    return {
      registrable: selector(state, 'registrable'),
      twoFAConfig: selector(state, 'twoFAConfig')
    };
  },
  {}
)(AccessFormRedux);
