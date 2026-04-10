import { Card } from 'lean-ui';
import EmailSettingForm from '../../containers/EmailSettingForm';
import i18n from 'utils/i18n';
import cs from './EmailSetting.less';
import setPageTitle from 'utils/setPageTitle';
import { setTrimString } from 'utils/trim';

export default class EmailSetting extends PureComponent {
  componentDidMount() {
    const { brandInfo } = this.props;

    if (brandInfo.siteName) {
      setPageTitle(
        `${brandInfo.siteName} - ${i18n[
          'navigation.personal_center.module_name'
        ]}`
      );
    }
  }

  state = {
    showSuccessTip: false
  };

  update = data => {
    const { updateEmail } = this.props;
    updateEmail(setTrimString(data.newEmail)).then(({ result }) => {
      if (result) {
        this.setState({
          showSuccessTip: true
        });
      }
    });
  };

  render() {
    const { showSuccessTip } = this.state;
    const { userInfo } = this.props;
    const info = {
      origin: userInfo.email,
      newEmail: ''
    };

    return (
      <Card>
        <div className={cs['head']}>
          {i18n['user_setting.email_setting.email_setting']}
        </div>
        <div className={cs['body']}>
          <EmailSettingForm initialValues={info} onSubmit={this.update} />
          {showSuccessTip ? (
            <p className={`col-sm-offset-1 ${cs['tips']}`}>
              {i18n['user_setting.email_setting.send_success_tips']}
            </p>
          ) : (
            undefined
          )}
        </div>
      </Card>
    );
  }
}
