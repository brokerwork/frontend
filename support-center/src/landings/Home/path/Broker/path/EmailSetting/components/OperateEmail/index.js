import CardPanel from 'components/CardPanel';
import EmailForm, { EMAIL_FORM } from '../Forms/Email';
import i18n from 'utils/i18n';
import cs from './OperateEmail.less';
import TestEmail from '../../containers/TestEmail';
import Button from 'components/Button';


export default class OperateEmail extends PureComponent {
  state = {
    showTestEmailModal: false,
    test: false,
    values: this.props.emailTarget || {}
  }

  toggleModal = (status) => {
    this.setState({
      showTestEmailModal: status
    });
  }

  onSave = () => {
    const { submitForm } = this.props;

    submitForm(EMAIL_FORM);
  }

  onSubmit = (values) => {
    const { test } = this.state;
    const { createEmail, updateEmail, showTopAlert, onSave, emailTarget, _setEmailTarget } = this.props;
    const copyData = JSON.parse(JSON.stringify(values));
    const action = emailTarget.id ? updateEmail : createEmail;

    if (test) {
      Promise.resolve(_setEmailTarget(values)).then(() => {
        this.setState({
          showTestEmailModal: true,
          test: false,
          values
        });
      });
    } else {
      action(copyData).then(({ result }) => {
        if (result) {
          showTopAlert({
            style: 'success',
            content: i18n['general.save_success']
          });
          onSave();
        }
      });
    }
  }

  test = () => {
    this.setState({
      test: true
    }, () => {
      this.onSave();
    });
  }

  onTestEmail = () => {
    const { _setEmailTarget, createEmail, updateEmail, getEmailList, emailTarget } = this.props;
    const { values } = this.state;
    const action = emailTarget.id ? updateEmail : createEmail;

    action(values).then(({ result, data }) => {
      if (result) {
        _setEmailTarget({
          ...values,
          id: data
        });
        getEmailList().then(() => {
          this.setState({
            showTestEmailModal: false
          });
        });
      }
    });
  }

  onProviderChange = (value) => {
    const { emailProvider, emailFromName } = this.props;
    const { values } = this.state;
    const currentProvider = emailProvider.find(item => item.value == value);

    this.setState({
      values: {
        ...values,
        provider: value,
        security: currentProvider.security,
        host: currentProvider.host,
        port: currentProvider.port,
        username: '',
        password: '',
        from: '',
        fromName: emailFromName || ''
      }
    });
  }

  render() {
    const { emailProvider, securityType, onClose } = this.props;
    const { showTestEmailModal, values } = this.state;

    return (
      <CardPanel onClose={onClose}>
        <CardPanel.Header>
          {values.id
            ? i18n['email.setting.smtp.btn.modify']
            : i18n['email.setting.smtp.btn.add']}
        </CardPanel.Header>
        <CardPanel.Body className={cs['body']}>
          <div className={cs['form']}>
            <EmailForm
              onProviderChange={this.onProviderChange}
              initialValues={values}
              onSubmit={this.onSubmit}
              emailProvider={emailProvider}
              securityType={securityType}
            ></EmailForm>
          </div>
          {showTestEmailModal
            ? <TestEmail 
                emailTarget={values}
                onSave={this.onTestEmail}
                onClose={this.toggleModal.bind(this, false)}>
              </TestEmail>
            : undefined}
        </CardPanel.Body>
        <CardPanel.Footer>
          <Button style="primary" onClick={this.onSave}>{i18n['app.btn.save']}</Button>
          <Button style="primary" onClick={this.test}>{i18n['email.setting.smtp.btn.send.test']}</Button>
          <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
        </CardPanel.Footer>
      </CardPanel>
    );
  }
}