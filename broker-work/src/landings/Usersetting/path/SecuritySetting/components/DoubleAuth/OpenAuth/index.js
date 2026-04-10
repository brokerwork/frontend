import cs from './style.less';
import { Input, Button } from 'lean-ui';
import i18n from 'utils/i18n';

export default class OpenAuth extends PureComponent {
  state = {
    ready: false,
    value: ''
  };
  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  componentDidMount() {
    const { getGoogle } = this.props;
    getGoogle().then(({ result }) => {
      this.setState({
        ready: true
      });
    });
  }
  submit = () => {
    const {
      openAuth,
      googleInfo,
      setOriginStatusChange,
      setAuthStatus,
      getAuthState
    } = this.props;
    const { value } = this.state;
    if (!value) {
      return;
    }
    openAuth({
      secret: googleInfo.secret,
      verificationCode: value
    }).then(({ result }) => {
      if (result) {
        getAuthState();
        setOriginStatusChange('open');
        setAuthStatus('open');
      }
    });
  };
  render() {
    const { value, ready } = this.state;
    const { googleInfo, setAuthStatus } = this.props;
    return ready ? (
      <div>
        <div className={cs.title}>
          {i18n['user_setting.double_auth.open_bind.step1']}
        </div>
        <img src={googleInfo.qrCode} width="150" height="150" />
        <div>
          <p>{i18n['user_setting.double_auth.open_bind.step1.hand']}</p>
          {googleInfo.secret}
        </div>
        <div>{i18n['user_setting.double_auth.open_bind.step1.tip']}</div>
        <div className={cs.title}>
          {i18n['user_setting.double_auth.open_bind.step2']}
        </div>
        <div className={cs.input}>
          <Input value={value} onChange={this.onChange} />
        </div>
        <div className={cs.footer}>
          <Button type="primary" onClick={this.submit}>
            {i18n['user_setting.double_auth.open_bind.btn']}
          </Button>
          <Button onClick={() => setAuthStatus('close')}>
            {i18n['general.cancel']}
          </Button>
        </div>
      </div>
    ) : null;
  }
}
