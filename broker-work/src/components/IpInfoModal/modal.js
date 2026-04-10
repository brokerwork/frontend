import cs from './ModalMessage.less';
import { Button } from 'lean-ui';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import { get } from 'utils/ajax';
export default class IpInfoModal extends PureComponent {
  state = {
    dataReady: false,
    message: ''
  };
  componentDidMount() {
    const { loginIpInfo, getIpLocation } = this.props;
    if (loginIpInfo.lastLoginIp) {
      get({
        url: `/v1/common/ip/location?ip=${loginIpInfo.lastLoginIp}`
      }).then(res => {
        if (res.data) {
          this.setState({
            message: res.data,
            dataReady: true
          });
        } else {
          this.setState({
            dataReady: true
          });
        }
      });
    }
  }
  viewMessage = e => {
    e.preventDefault();
    window.location.href = `/securityReset`;
    this.setState({
      dataReady: true
    });
  };
  onClose = () => {
    const { updateLoginIpInfo, loginIpInfo } = this.props;
    updateLoginIpInfo({ ...loginIpInfo, closed: true });
    this.setState({
      dataReady: false
    });
  }
  render() {
    const { loginIpInfo } = this.props;
    const { dataReady, message } = this.state;
    if (!dataReady) return null;
    return (
      <div className={`${cs['container']} modal-content`}>
        <div className="modal-header">
          <button
            type="button"
            className="close"
            onClick={this.onClose}
          />
          {i18n['security_setting.ip.title']}
        </div>
        <div className={`modal-body`}>
          <div className={cs['message-body']}>
            <FormattedMessage
              id="security_setting.ip.content"
              defaultMessage={i18n['security_setting.ip.content']}
              values={{
                ip: `${loginIpInfo.lastLoginIp}`,
                location: `${message}`
              }}
            />
            <div>{i18n['security_setting.ip.content2']}</div>
          </div>
        </div>
        <div className="modal-footer">
          <Button type="primary" onClick={this.viewMessage}>
            {i18n['security_setting.go_to_reset']}
          </Button>
        </div>
      </div>
    );
  }
}
