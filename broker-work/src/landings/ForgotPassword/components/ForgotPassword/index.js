import { Component } from 'react';
import Root from 'landings/Home/containers/Root';
import Header from 'landings/Home/components/Header';
import { Form, Button, Input } from 'lean-ui';
import { NavLink as Link } from 'react-router-dom';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import { getLoginPosition } from 'utils/loginPosition';

import loginCs from 'landings/Home/components/Login/Login.less';
import cs from './ForgotPassword.less';

const loginBoxPosition = getLoginPosition();
export default class ForgotPassword extends Component {
  state = {
    disabled: false
  };
  modifyEmail = e => {
    const { modifyEmail } = this.props;
    modifyEmail(e.target.value);
  };
  submit = () => {
    const {
      submit,
      email,
      history: { push },
      showTopAlert
    } = this.props;
    this.setState({
      disabled: true
    });
    submit(setTrimString(email)).then(({ data }) => {
      if (data !== 'ok') {
        this.setState({
          disabled: false
        });
        return;
      }
      showTopAlert({
        content: i18n['login.forget_pwd.send_success'],
        bsStyle: 'success'
      });
      setTimeout(() => {
        push('/');
      }, 3 * 1000);
    });
  };
  onLanguageChange = type => {
    this.props.setLanguageType(type);
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

  renderLeft = () => {
    const {
      errorMessage,
      email,
      brandInfo: { productLogo, companySite }
    } = this.props;
    const { disabled } = this.state;
    return (
      <Root align="left">
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          title={<img className={cs['logo']} src={productLogo} alt="logo" />}
        />
        <Form className={cs['form']}>
          <Form.Item col={1} className={cs['leftTitle']}>
            {i18n['login.forget_pwd.find_pwd']}
          </Form.Item>
          <Form.Item col={1}>
            <Form.Label>
              {i18n['login.forget_pwd.email_placeholder']}
            </Form.Label>
            <Form.Control>
              <Input
                value={email}
                onChange={this.modifyEmail}
                line
                className={`${loginCs['input']}`}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item col={1}>
            <Button
              className={cs['centerSubmit']}
              onClick={this.submit}
              type="primary"
              disabled={disabled}
            >
              {i18n['login.forget_pwd.send_email']}
            </Button>
          </Form.Item>
          <Form.Item col={1}>
            <Link
              to="/"
              className={`${cs['back-to-login']} ${
                cs['centerLogin']
              } main-color main-color-border`}
            >
              {i18n['login.forget_pwd.login']}
            </Link>
          </Form.Item>
        </Form>
      </Root>
    );
  };
  renderCenter = () => {
    const {
      errorMessage,
      email,
      brandInfo: { companySite }
    } = this.props;
    const { disabled } = this.state;
    return (
      <Root>
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          title={i18n['login.forget_pwd.find_pwd']}
        />
        <Form className={cs['form']}>
          <Form.Item col={1}>
            <Form.Label>
              {i18n['login.forget_pwd.email_placeholder']}
            </Form.Label>
            <Form.Control>
              <Input
                value={email}
                onChange={this.modifyEmail}
                className={`${loginCs['input']}`}
              />
            </Form.Control>
          </Form.Item>
          <Form.Item col={1}>
            <Button
              className={cs['centerSubmit']}
              onClick={this.submit}
              type="primary"
              disabled={disabled}
            >
              {i18n['login.forget_pwd.send_email']}
            </Button>
          </Form.Item>
          <Form.Item col={1}>
            <Link
              to="/"
              className={`${cs['back-to-login']} ${
                cs['centerLogin']
              } main-color main-color-border`}
            >
              {i18n['login.forget_pwd.login']}
            </Link>
          </Form.Item>
        </Form>
      </Root>
    );
  };

  renderRight = () => {
    const {
      errorMessage,
      email,
      brandInfo: { productLogo, companySite }
    } = this.props;
    const { disabled } = this.state;
    return (
      <Root align="right">
        <Header
          onLanguageChange={this.onLanguageChange}
          errorMessage={errorMessage}
          companySite={companySite}
          fixed
          title={<img className={cs['logo']} src={productLogo} alt="logo" />}
        />
        <Form className={cs['form']}>
          <Form.Item col={1} className={cs['rightTitle']}>
            {i18n['login.forget_pwd.find_pwd']}
          </Form.Item>
          <Form.Item col={1}>
            <Input
              value={email}
              placeholder={i18n['login.forget_pwd.email_placeholder']}
              onChange={this.modifyEmail}
              className={`${loginCs['input']} ${cs['rightInput']}`}
            />
          </Form.Item>
          <Form.Item col={2} className={cs['rightItem1']}>
            <Button
              onClick={this.submit}
              size="lg"
              type="primary"
              className={`${loginCs['submit-btn']} ${cs['rightInput']}`}
              disabled={disabled}
            >
              {i18n['login.forget_pwd.send_email']}
            </Button>
          </Form.Item>
          <Form.Item col={2} className={cs['rightItem2']}>
            <Link
              to="/"
              className={`${cs['back-to-login']} ${
                cs['rightInput']
              } main-color main-color-border`}
            >
              {i18n['login.forget_pwd.login']}
            </Link>
          </Form.Item>
        </Form>
      </Root>
    );
  };
}
