import { Component } from 'react';
import getQueryString from 'utils/queryString';
import Root from 'landings/Home/containers/Root';
import Header from 'landings/Home/components/Header';
import { Form, Button, Input } from 'lean-ui';
import { NavLink as Link } from 'react-router-dom';
import i18n from 'utils/i18n';
import { getLoginPosition } from 'utils/loginPosition';

import loginCs from 'landings/Home/components/Login/Login.less';
import cs from 'landings/ForgotPassword/components/ForgotPassword/ForgotPassword.less';

const loginBoxPosition = getLoginPosition();
export default class ResetPassword extends Component {
  componentDidMount() {
    const { modifyParams, getPasswordReg } = this.props;
    const query = getQueryString(window.location.search);
    modifyParams({
      email: query.get('email'),
      ticket: query.get('ticket')
    });
    getPasswordReg();
  }
  modifyPassword = (field, e) => {
    const { modifyParams, resetPasswordParams } = this.props;
    modifyParams({
      ...resetPasswordParams,
      [field]: e.target.value
    });
  };
  onLanguageChange = type => {
    this.props.setLanguageType(type);
  };
  submit = () => {
    const {
      submit,
      showError,
      resetPasswordParams,
      history: { push },
      showTopAlert,
      passwordReg
    } = this.props;
    const { newPwd, verified } = resetPasswordParams;
    if (!newPwd || !verified) {
      showError(i18n['login.reset_password.error.require']);
      return;
    }
    if (newPwd !== verified) {
      showError(i18n['login.reset_password.error.not_the_same']);
      return;
    }
    if (!passwordReg.reg.test(newPwd)) {
      showError(`${i18n['PUB_AUTH_0000060']}, ${passwordReg.tips}`);
      return;
    }
    showError();
    submit(resetPasswordParams).then(({ data }) => {
      if (data !== 'ok') return;
      showTopAlert({
        content: i18n['login.reset_password.success'],
        bsStyle: 'success'
      });
      setTimeout(() => {
        push('/');
      }, 3 * 1000);
    });
  };

  render() {
    let v;
    switch (loginBoxPosition) {
      case 'LEFT':
        v = this.renderLeft();
        break;
      case 'RIGHT':
        v = this.renderRight();
        break;
      default:
        v = this.renderCenter();
        break;
    }
    return v;
  }

  renderRight = () => {
    const {
      errorMessage,
      newPassword,
      repeatPassword,
      resetPasswordParams,
      brandInfo: { productLogo, companySite }
    } = this.props;
    const { newPwd, verified } = resetPasswordParams;
    return (
      <Root align="right">
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          fixed
          title={<img className={cs['logo']} src={productLogo} alt="logo" />}
        />{' '}
        <Form className={cs['form']}>
          <Form.Item col={1} className={cs['rightTitle']}>
            {' '}
            {i18n['login.reset_password.reset_pwd']}{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Input
              type="password"
              value={newPwd}
              placeholder={i18n['login.reset_password.new_pwd']}
              className={`${loginCs['input']} ${cs['rightInput']}`}
              onChange={this.modifyPassword.bind(this, 'newPwd')}
            />{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Input
              type="password"
              value={verified}
              placeholder={i18n['login.reset_password.confirm_pwd']}
              className={`${loginCs['input']} ${cs['rightInput']}`}
              onChange={this.modifyPassword.bind(this, 'verified')}
            />{' '}
          </Form.Item>{' '}
          <Form.Item col={2} className={cs['rightItem1']}>
            <Button
              onClick={this.submit}
              type="primary"
              className={`${loginCs['submit-btn']} ${cs['rightInput']}`}
            >
              {' '}
              {i18n['login.reset_password.next_step']}{' '}
            </Button>{' '}
          </Form.Item>{' '}
          <Form.Item col={2} className={cs['rightItem2']}>
            <Link
              to="/"
              className={`${cs['back-to-login']} ${
                cs['rightInput']
              } main-color main-color-border`}
            >
              {' '}
              {i18n['login.forget_pwd.login']}{' '}
            </Link>{' '}
          </Form.Item>{' '}
        </Form>{' '}
      </Root>
    );
  };

  renderLeft = () => {
    const {
      errorMessage,
      newPassword,
      repeatPassword,
      resetPasswordParams,
      brandInfo: { productLogo, companySite }
    } = this.props;
    const { newPwd, verified } = resetPasswordParams;
    return (
      <Root align="left">
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          title={<img className={cs['logo']} src={productLogo} alt="logo" />}
        />{' '}
        <Form className={cs['form']}>
          <Form.Item col={1} className={cs['leftTitle']}>
            {' '}
            {i18n['login.reset_password.reset_pwd']}{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Form.Label> {i18n['login.reset_password.new_pwd']} </Form.Label>{' '}
            <Form.Control>
              <Input
                type="password"
                line
                value={newPwd}
                onChange={this.modifyPassword.bind(this, 'newPwd')}
              />{' '}
            </Form.Control>{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Form.Label>
              {' '}
              {i18n['login.reset_password.confirm_pwd']}{' '}
            </Form.Label>{' '}
            <Form.Control>
              <Input
                type="password"
                line
                value={verified}
                onChange={this.modifyPassword.bind(this, 'verified')}
              />{' '}
            </Form.Control>{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Button
              onClick={this.submit}
              type="primary"
              className={cs['centerSubmit']}
            >
              {' '}
              {i18n['login.reset_password.next_step']}{' '}
            </Button>{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Link
              to="/"
              className={`${cs['back-to-login']} ${
                cs['centerLogin']
              } main-color main-color-border`}
            >
              {' '}
              {i18n['login.forget_pwd.login']}{' '}
            </Link>{' '}
          </Form.Item>{' '}
        </Form>{' '}
      </Root>
    );
  };

  renderCenter = () => {
    const {
      errorMessage,
      newPassword,
      repeatPassword,
      resetPasswordParams,
      brandInfo: { companySite }
    } = this.props;
    const { newPwd, verified } = resetPasswordParams;
    return (
      <Root>
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          title={i18n['login.reset_password.reset_pwd']}
        />{' '}
        <Form className={cs['form']}>
          <Form.Item col={1}>
            <Form.Label> {i18n['login.reset_password.new_pwd']} </Form.Label>{' '}
            <Form.Control>
              <Input
                type="password"
                value={newPwd}
                onChange={this.modifyPassword.bind(this, 'newPwd')}
              />{' '}
            </Form.Control>{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Form.Label>
              {' '}
              {i18n['login.reset_password.confirm_pwd']}{' '}
            </Form.Label>{' '}
            <Form.Control>
              <Input
                type="password"
                value={verified}
                onChange={this.modifyPassword.bind(this, 'verified')}
              />{' '}
            </Form.Control>{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Button
              onClick={this.submit}
              type="primary"
              className={cs['centerSubmit']}
            >
              {' '}
              {i18n['login.reset_password.next_step']}{' '}
            </Button>{' '}
          </Form.Item>{' '}
          <Form.Item col={1}>
            <Link
              to="/"
              className={`${cs['back-to-login']} ${
                cs['centerLogin']
              } main-color main-color-border`}
            >
              {' '}
              {i18n['login.forget_pwd.login']}{' '}
            </Link>{' '}
          </Form.Item>{' '}
        </Form>{' '}
      </Root>
    );
  };
}
