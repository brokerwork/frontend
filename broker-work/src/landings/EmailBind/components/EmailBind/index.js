import { Component } from 'react';
import getQueryString from 'utils/queryString';
import Root from 'landings/Home/containers/Root';
import { Button } from 'react-bootstrap';
import i18n from 'utils/i18n';

import loginCs from 'landings/Home/components/Login/Login.less';
import cs from './EmailBind.less';

export default class EmailBind extends Component {
  state = {
    email: '',
    status: false,
    ready: false
  };
  componentDidMount() {
    const { getEmailState } = this.props;
    const queryData = getQueryString(window.location.search);
    const query = {
      email: queryData.get('email'),
      ticket: queryData.get('ticket')
    };
    getEmailState(query).then(({ data, mcode }) => {
      const state = {
        email: query.email || '',
        status: data,
        msg: data
          ? i18n['login.bind_email.status_success_msg']
          : i18n.mcode(mcode),
        ready: true
      };
      this.setState(state);
    });
  }
  submit = () => {
    this.props.history.push('/');
  };

  render() {
    const { ready, email, status, msg } = this.state;
    if (!ready) return null;
    return (
      <Root>
        <div className={cs['container']}>
          <div className={cs['status']}>
            <i
              className={`fa fa-${status ? 'check' : 'times'}-circle-o ${status
                ? cs['success']
                : cs['fail']}`}
            />
            {status
              ? i18n['login.bind_email.status_success']
              : i18n['login.bind_email.status_fail']}
          </div>
          <div>{`${i18n['login.bind_email.account']}: ${email}`}</div>
          <div>{msg}</div>
        </div>
        <div className={cs['submit-box']}>
          <Button
            onClick={this.submit}
            bsSize="lg"
            bsStyle="primary"
            className={loginCs['submit-btn']}
          >
            {i18n['login.bind_email.login']}
          </Button>
        </div>
      </Root>
    );
  }
}
