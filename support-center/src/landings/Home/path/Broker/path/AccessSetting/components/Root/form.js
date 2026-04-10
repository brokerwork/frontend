import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import FormField from 'components/FormField';
import Form from 'components/Form';
import i18n from 'utils/i18n';
import Tips from 'components/Tips';
import cs from './style.less';

export const ACCESS_SETTING_FORM = 'BW_ACCESS_SETTING_FORM';

class AccessSettingForm extends PureComponent {
  render() {
    const { brokerRights } = this.props;
    return (
      <Form>
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
          <Form.Label>{i18n['access.setting.logout.timeout']}：</Form.Label>
          <Form.Control>
            <Field name="logoutTime" fieldType="number" component={FormField} />
          </Form.Control>
          <Form.HelpText>
            {i18n['access.setting.minute.unit']}
            <span className="tips">{i18n['access.setting.logout.timeout.tips']}</span>
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
        {brokerRights.includes('SC_SECURITY_SET') ? (
          <Form.Item className="double-auth">
            <Form.Label>
              {i18n['broker.access_setting.double_validate']}
              <Tips className={cs.tips} align="top">
                {i18n['broker.access_setting.double_validate.tip']}
              </Tips>
              ：
            </Form.Label>
            <Form.Control>
              <Field
                name="GoogleAuthenticator"
                fieldType="checkbox"
                label={i18n['broker.access_setting.double_validate.GoogleAuthenticator']}
                component={FormField}
              />
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
        <Form.Item>
          <Form.Label>
            {i18n['broker.access_setting.ip_error_tips']}
            <Tips className={cs.tips} align="top">
              {i18n['broker.access_setting.ip_error_tips_help']}
            </Tips>
            ：
          </Form.Label>
          <Form.Control>
            <Field
              name="ipExceptionPrompt"
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

export default AccessFormRedux;
