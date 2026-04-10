import ContentWrapper from 'components/ContentWrapper';
import i18n from 'utils/i18n';
import AccessSettingForm, { ACCESS_SETTING_FORM } from './form';
import Button from 'components/Button';
import cs from './style.less';
import _ from 'lodash';
import { SubmissionError } from 'redux-form';

const validKeys = [
  {
    key: 'verificationLoginFailTimes',
    min: 0,
    max: 10,
    error: i18n['access.setting.message.tip2']
  },
  {
    key: 'lockLoginFailTimes',
    min: 3,
    max: 20,
    error: i18n['access.setting.message.tip3']
  },
  {
    key: 'logoutTime',
    min: 1,
    max: 1000,
    error: i18n['access.setting.message.tip4']
  }
];

export default class Root extends PureComponent {
  state = {
    dataReady: false
  };
  componentDidMount() {
    const { getAccessSetting, rightFunction } = this.props;
    getAccessSetting().then(() => {
      this.setState({
        dataReady: true
      });
    });
    rightFunction();
  }
  submit = () => {
    const { submitForm } = this.props;
    submitForm(ACCESS_SETTING_FORM);
  };
  onReset = () => {
    const { reset } = this.props;
    reset(ACCESS_SETTING_FORM);
  };
  onSubmit = values => {
    let errors = {};
    const { updateAccessSetting, showTopAlert } = this.props;
    validKeys.forEach(valid => {
      const isValiPass = this.numberValidPass(values[valid.key], valid.min, valid.max);
      if (!isValiPass) {
        errors[valid.key] = valid.error;
      }
    });
    if (values.lockLoginFailTimes <= values.verificationLoginFailTimes) {
      errors.lockLoginFailTimes = i18n['access.setting.message.tip3'];
    }
    // 二次验证
    values.twoFAConfig = {};
    if (values.GoogleAuthenticator) {
      values.twoFAConfig.enable = true;
      values.twoFAConfig.types = ['GoogleAuthenticator'];
    } else {
      values.twoFAConfig.enable = false;
      values.twoFAConfig.types = [];
    }

    if (_.keys(errors).length) {
      throw new SubmissionError(errors);
    }
    values.productId = 'BW';
    let copyData = _.cloneDeep(values);
    delete copyData.GoogleAuthenticator;
    updateAccessSetting(copyData).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['access.setting.message.tip1']
        });
      }
    });
  };
  numberValidPass = (val, min, max) => {
    const num = Number(val);
    if (isNaN(num)) {
      return false;
    }
    if (num >= min && num <= max) {
      return true;
    }
    return false;
  };
  render() {
    const { dataReady } = this.state;
    const { accessSetting, brokerRights } = this.props;
    return (
      <ContentWrapper header={i18n['left.menu.access.setting']}>
        <div className={cs['access-settings']}>
          {dataReady ? <AccessSettingForm initialValues={accessSetting} brokerRights={brokerRights} onSubmit={this.onSubmit} /> : null}
          <div className={cs['footer']}>
            <Button style="primary" onClick={this.submit}>
              {i18n['app.btn.save']}
            </Button>
            <Button onClick={this.onReset}>{i18n['app.btn.reset']}</Button>
          </div>
        </div>
      </ContentWrapper>
    );
  }
}
