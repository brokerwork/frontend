import * as React from 'react';
import * as cs from './login.less';
import { observable, computed, action } from 'mobx';
import { observer } from 'mobx-react';
import logo from './logo.png';
import { InputItem, Button, WhiteSpace, Toast } from 'antd-mobile';
import Ajax from '@/ajax';
import ls, { TOKEN } from '@/utils/storage';

class LoginState {
  @observable name = 'rick';
  @observable password = '';
}
let state = new LoginState();
@observer
class Login extends React.Component {
  state = {
    name: '',
    password: ''
  };
  componentDidMount() {}
  login = () => {
    const { name, password } = this.state;
    const { history } = this.props;
    if (!name) {
      Toast.info('请输入账号');
      return;
    }
    if (!password) {
      Toast.info('请输入密码');
      return;
    }
    Ajax.post('/v1/pub/auth/login/captcha', {
      loginName: name,
      password
    }).then(data => {
      ls.set(TOKEN, data.token);
      history.push('accountList');
    });
  };
  change = (type, value) => {
    this.setState({
      [type]: value
    });
  };
  render() {
    const { name, password } = this.state;
    return (
      <div className={cs.content}>
        <div className={cs.margin}>
          <img src={logo}></img>
        </div>
        <InputItem
          clear
          value={name}
          onChange={this.change.bind(this, 'name')}
          placeholder="请输入账号"
        >
          账号
        </InputItem>
        <InputItem
          onChange={this.change.bind(this, 'password')}
          clear
          value={password}
          type="password"
          placeholder="请输入密码"
        >
          密码
        </InputItem>
        <Button className={cs.margin} onClick={this.login} type="primary">
          登录
        </Button>
      </div>
    );
  }
}
export default Login;
