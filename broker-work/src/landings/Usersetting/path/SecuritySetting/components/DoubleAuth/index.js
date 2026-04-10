import { Radio } from 'lean-ui';
import i18n from 'utils/i18n';
import Tips from './Tips';
import cs from './style.less';
import OpenAuth from '../../containers/OpenAuth';
import CloseAuth from '../../containers/CloseAuth';

const RadioGroup = Radio.Group;
export default class SecurityRoot extends PureComponent {
  constructor(props) {
    super(props);
    const enableAuth = _.get(props, 'authState', false);
    const status = enableAuth ? 'open' : 'close';
    this.state = {
      authStatus: status,
      originStatus: status
    };
  }
  setAuthStatus = status => {
    this.setState({
      authStatus: status
    });
  };
  setOriginStatusChange = status => {
    this.setState({
      originStatus: status
    });
  };
  render() {
    const { authStatus, originStatus } = this.state;
    return (
      <div className={cs['double-auth']}>
        <h4>Google Authenticator</h4>
        {originStatus === authStatus ? (
          <div>
            {i18n['general.state']}:
            <RadioGroup value={authStatus} onChange={this.setAuthStatus}>
              <Radio value={'close'}>{i18n['general.close']}</Radio>
              <Radio value={'open'}>{i18n['general.open']}</Radio>
            </RadioGroup>
          </div>
        ) : null}
        {originStatus === 'close' && authStatus === 'open' ? (
          <OpenAuth
            setAuthStatus={this.setAuthStatus}
            setOriginStatusChange={this.setOriginStatusChange}
          />
        ) : null}
        {originStatus === 'open' && authStatus === 'close' ? (
          <CloseAuth
            setAuthStatus={this.setAuthStatus}
            setOriginStatusChange={this.setOriginStatusChange}
          />
        ) : null}
        {originStatus === 'close' && authStatus === 'open' ? null : <Tips />}
      </div>
    );
  }
}
