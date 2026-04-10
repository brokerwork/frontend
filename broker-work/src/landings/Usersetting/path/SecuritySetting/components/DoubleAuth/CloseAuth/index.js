import cs from './style.less';
import { Input, Button } from 'lean-ui';
import i18n from 'utils/i18n';

export default class OpenAuth extends PureComponent {
  state = {
    value: ''
  };
  onChange = e => {
    this.setState({
      value: e.target.value
    });
  };
  submit = () => {
    const {
      closeAuth,
      googleInfo,
      setOriginStatusChange,
      setAuthStatus,
      getAuthState
    } = this.props;
    const { value } = this.state;
    if (!value) {
      return;
    }
    closeAuth(value).then(({ result }) => {
      if (result) {
        getAuthState();
        setOriginStatusChange('close');
        setAuthStatus('close');
      }
    });
  };
  render() {
    const { value } = this.state;
    const { googleInfo, setAuthStatus } = this.props;
    return (
      <div>
        {i18n['general.valid_code']}:
        <div className={cs.input}>
          <Input value={value} onChange={this.onChange} />
        </div>
        <div className={cs.footer}>
          <Button type="primary" onClick={this.submit}>
            {i18n['user_setting.double_auth.close_bind.btn']}
          </Button>
          <Button onClick={() => setAuthStatus('open')}>
            {i18n['general.cancel']}
          </Button>
        </div>
        <a href="javascript:;">
          {i18n['user_setting.double_auth.close_bind.tip1']}
        </a>
        {i18n['user_setting.double_auth.close_bind.tip2']}
      </div>
    );
  }
}
