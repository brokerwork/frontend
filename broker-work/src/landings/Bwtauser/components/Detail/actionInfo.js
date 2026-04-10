import i18n from 'utils/i18n';
import cs from './index.less';
import ChangePasswordModal from './changePasswordModal';
import { Card, Button, Form, Switch, Tooltip, Icon, Message } from 'lean-ui';
import _ from 'lodash';
const FormItem = Form.Item;
const FormLabel = Form.Label;
const FormControl = Form.Control;

export default class ActionInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginState: props.userInfo.isEnable,
      showChangePasswordModal: false
    };
  }
  toggleModal = toggle => {
    this.setState({
      showChangePasswordModal: toggle
    });
  };
  changePassword = data => {
    const {
      updateUserPassword,
      match: { params }
    } = this.props;
    updateUserPassword(params.userId, data).then(({ result }) => {
      if (result) {
        Message.success(i18n['general.modify_success']);
        this.toggleModal(false);
      }
    });
  };
  changeEnable = v => {
    const { updateLoginStatus, userInfo, users, showTipsModal } = this.props;
    if (_.includes(userInfo.restrictions, 'LOGIN') && v === true) {
      Message.error(i18n['tausermgmt.black_list.warn']);
      this.setState({
        loginState: false
      })
    } else {
      this.update(userInfo.userNo, v);
    }
  };
  update = (userNo, v) => {
    const { updateLoginStatus } = this.props;
    updateLoginStatus(userNo, v).then(({ result }) => {
      if (result) {
        Message.success(
          v ? i18n['general.active_success'] : i18n['general.disabled_success']
        );
      }
    });
  };

  changeEnableDeposit = v => {
    const { updateDepositStatus, userInfo } = this.props;
    updateDepositStatus(userInfo.userNo, v).then(({ result }) => {
      if (result) {
        Message.success(
          v ? i18n['general.active_success'] : i18n['general.disabled_success']
        );
      }
    });
  };
  resetDoubleValidate = type => {
    const {
      showTipsModal,
      faReset,
      match: { params },
      getUserInfo
    } = this.props;
    showTipsModal({
      content: i18n['tausermgmt.detail.panel_double_validate_reset.tips'],
      title: i18n['tausermgmt.detail.panel_double_validate_reset'],
      onConfirm: cb => {
        const endParams = {
          taUserId: params.userId && Number(params.userId),
          type
        };
        faReset(endParams).then(res => {
          if (res.result) {
            Message.success(
              i18n['tausermgmt.detail.panel_double_validate_reset_success']
            );
            getUserInfo(params.userId);
            cb();
          }
        });
      }
    });
  };

  render() {
    const { userInfo, accessConfig, versionRights } = this.props;
    const { showChangePasswordModal, loginState } = this.state;
    const googleStatus = _.get(userInfo, 'twoFaConfig', []).some(
      item => item === 'GoogleAuthenticator'
    );
    const smsStatus = _.get(userInfo, 'twoFaConfig', []).some(
      item => item === 'SMS'
    );
    // userInfo.twoFAConfig
    const isDoubleValidateEnable = _.get(
      accessConfig,
      'twoFAConfig.enable',
      false
    );
    const isGoogleEnable = _.get(accessConfig, 'twoFAConfig.types', []).some(
      item => item === 'GoogleAuthenticator'
    );
    const isSmsEnable = _.get(accessConfig, 'twoFAConfig.types', []).some(
      item => item === 'SMS'
    );
    return (
      <Card className={cs['card-style']}>
        <h3 className={cs['form-title']}>{i18n['general.control']}</h3>
        <Form>
          <FormItem col={2}>
            <FormLabel>{i18n['tausermgmt.disabled.login']}：</FormLabel>
            <FormControl>
              <Switch
                onChange={this.changeEnable}
                checked={loginState}
              />
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.disabled.online_payment']}：
            </FormLabel>
            <FormControl>
              <Switch
                onChange={this.changeEnableDeposit}
                checked={userInfo.enableDeposit}
              />
              <Tooltip
                trigger="click"
                placement="right"
                title={i18n['tausermgmt.disabled.status_tips']}
              >
                <Icon
                  icon="question"
                  className={`main-color ${cs['question-icon']}`}
                />
              </Tooltip>
            </FormControl>
          </FormItem>
          <FormItem col={2}>
            <FormLabel>
              {i18n['tausermgmt.detail.panel_reset_password']}：
            </FormLabel>
            <FormControl>
              <Button
                id="changePasswordButton"
                type="primary"
                onClick={this.toggleModal.bind(this, true)}
              >
                {i18n['tausermgmt.detail.panel_reset_password_btn']}
              </Button>
            </FormControl>
          </FormItem>
          {isDoubleValidateEnable &&
            versionRights['SC_SECURITY_SET'] && (
              <FormItem col={2}>
                <FormLabel>
                  {i18n['tausermgmt.detail.panel_double_validate_status']}：
                </FormLabel>
                <FormControl>
                  <div className={cs.double_validate}>
                    {isSmsEnable && (
                      <div>
                        {i18n['tausermgmt.detail.panel_double_validate_sms']}
                        <span>
                          {
                            i18n[
                              `${
                                smsStatus
                                  ? 'general.enabled'
                                  : 'general.disenabled'
                              }`
                            ]
                          }
                        </span>
                        {smsStatus && (
                          <Button
                            type="primary"
                            size="small"
                            onClick={this.resetDoubleValidate.bind(this, 'SMS')}
                            className={cs.reset_btn}
                          >
                            {i18n['general.reset']}
                          </Button>
                        )}
                      </div>
                    )}
                    {isGoogleEnable && (
                      <div>
                        {i18n['tausermgmt.detail.panel_double_validate_google']}
                        <span>
                          {
                            i18n[
                              `${
                                googleStatus
                                  ? 'general.enabled'
                                  : 'general.disenabled'
                              }`
                            ]
                          }
                        </span>
                        {googleStatus && (
                          <Button
                            type="primary"
                            size="small"
                            onClick={this.resetDoubleValidate.bind(
                              this,
                              'GoogleAuthenticator'
                            )}
                            className={cs.reset_btn}
                          >
                            {i18n['general.reset']}
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                </FormControl>
              </FormItem>
            )}
        </Form>
        {showChangePasswordModal ? (
          <ChangePasswordModal
            onHide={this.toggleModal.bind(this, false)}
            onSave={this.changePassword}
          />
        ) : (
          undefined
        )}
      </Card>
    );
  }
}
