import { Card } from 'lean-ui';
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
        `${brandInfo.siteName} - ${i18n[
          'navigation.personal_center.module_name'
        ]}`
      );
    }
  }

  update = data => {
    const { updatePassword, showTopAlert, logout } = this.props;

    updatePassword(data).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.modify_success']
        });
        logout().then(res => {
          if (res.result) {
            window.location.href = '/';
          }
        });
      }
    });
  };

  render() {
    const { password_strength } = this.props;

    return (
      <div>
        <div className={cs['body']}>
          <ChangePwdForm
            password_strength={password_strength}
            onSubmit={this.update}
          />
        </div>
      </div>
    );
  }
}
