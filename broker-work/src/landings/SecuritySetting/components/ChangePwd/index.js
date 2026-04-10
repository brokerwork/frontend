import { Card, Message } from 'lean-ui';
import ChangePwdForm from '../../containers/ChangePwdForm';
import i18n from 'utils/i18n';
import cs from './ChangePwd.less';
import setPageTitle from 'utils/setPageTitle';

export default class ChangePwd extends PureComponent {
  componentDidMount() {
    const { brandInfo, getPasswordStrength } = this.props;
    getPasswordStrength();
    if (brandInfo.siteName) {
      setPageTitle(
        `${brandInfo.siteName} - ${
          i18n['navigation.personal_center.module_name']
        }`
      );
    }
  }
  submiting = false;
  update = data => {
    const { updatePassword, showTopAlert, logout } = this.props;
    this.submiting = true;
    updatePassword(data).then(({ result, mcode }) => {
      this.submiting = false;
      if (result) {
        Message.success(i18n['general.modify_success']);
        logout().then(res => {
          if (res.result) {
            window.location.href = '/';
          }
        });
      } else {
        mcode && Message.error(i18n[mcode]);
      }
    });
  };

  render() {
    const { password_strength } = this.props;

    return (
      <ChangePwdForm
        password_strength={password_strength}
        onSubmit={this.update}
      />
    );
  }
}
