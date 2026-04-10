import { reduxForm } from 'redux-form';
import Form from 'components/Form';
import Button from 'components/Button';
import { BasicSetting } from './BasicSetting';
import { UiSetting } from './UiSetting';
import i18n from 'utils/i18n';
import cs from './Forms.less';
import { LoginSetting } from './LoginSetting';
import { ThemeSetting } from './ThemeSetting';
import moment from 'moment';

export const BRAND_FORM = 'BROKER_BRAND_SETTING_BRAND_FORM';

class BrandForm extends PureComponent {
  state = {
    experienceUsers: []
  };

  componentWillReceiveProps({ initialValues: { experienceUsers = [] } }) {
    if (experienceUsers.length > 0) {
      this.onUiUserChange(experienceUsers);
    }
  }

  submit = values => {
    const { onSave } = this.props;
    values.experienceUsers = this.state.experienceUsers;
    if (values.languages && values.languages.length) {
      onSave(values);
    } else {
      let errors = {};
      errors.languages = i18n['brand.setting.languages'];
      return errors;
    }
  };

  // 用户选择框字段变化监听
  onUiUserChange = experienceUsers => {
    this.setState({
      experienceUsers: experienceUsers.map(user => ({ id: user.id, name: user.name }))
    });
  };
  /**
   * 新租户不显示新旧ui切换按钮
   */

  isShowUIchange = () => {
    const { brandFormValues: { started, ctrader } = {} } = this.props;
    const startTime = moment('2019-05-01 00:00:00').valueOf(); //此处写死了一个时间，用于和创建时间做比较，来判断是否是新租户，想法出于Mia
    if (ctrader && started < startTime) {
      return true;
    }
    return false;
  };
  render() {
    const { handleSubmit, reset, validDomain, productDomain, brandFormValues: { uiVersion } = {} } = this.props;

    const isBetaUI = uiVersion === 'BETA';
    return (
      <Form onSubmit={handleSubmit(this.submit)} showHelpText>
        <BasicSetting {...this.props} isBetaUI={isBetaUI} onLanguageStateChange={this.onLanguageStateChange} />
        {/* 暂时禁用UI切换的功能 */}
        {this.isShowUIchange() ? <UiSetting {...this.props} onUiUserChange={this.onUiUserChange} /> : null}
        {isBetaUI && <LoginSetting {...this.props} />}
        {isBetaUI && <ThemeSetting {...this.props} />}
        <div className={cs['formSection']}>
          <div className={cs['formSectionBody']}>
            <Form.Item>
              <Form.Label />
              <Form.Control>
                <Button style="primary" type="submit">
                  {i18n['app.btn.save']}
                </Button>
                {/* <Button onClick={reset}>
                  {i18n['app.btn.reset']}
                </Button> */}
              </Form.Control>
              <Form.HelpText />
            </Form.Item>
          </div>
        </div>
      </Form>
    );
  }
}

export default reduxForm({
  form: BRAND_FORM,
  enableReinitialize: true,
  onSubmitFail: errors => {
    setTimeout(() => {
      let errorDom = document.querySelectorAll('[class*=has-error]')[0].querySelector('input');
      errorDom.focus();
      let uploadErrorDom = document.querySelectorAll('[class*=has-error]')[0].querySelector('input[type=file]');
      if (uploadErrorDom) {
        document.querySelectorAll('[class*=has-error]')[0].setAttribute('tabindex', 0);
        document.querySelectorAll('[class*=has-error]')[0].focus();
      }
    }, 0);
  }
})(BrandForm);
