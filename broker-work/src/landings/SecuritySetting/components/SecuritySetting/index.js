import { Card } from 'lean-ui';
import ChangePwd from '../../containers/ChangePwd';
import i18n from 'utils/i18n';
import setPageTitle from 'utils/setPageTitle';
import cs from './style.less';

export default class SecuritySetting extends PureComponent {
  render() {
    return (
      <div className={cs['container']}>
        <div className={cs['warning']}>
          {i18n['security_setting.reset_password.warning']}
        </div>
        <div className={cs['body']}>
          <ChangePwd />
        </div>
      </div>
    );
  }
}
