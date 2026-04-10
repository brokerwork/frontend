import Modal from 'components/Modal';
import Button from 'components/Button';
import TestEmailForm, { TEST_EMAIL_FORM } from '../Forms/TestEmail';
import i18n from 'utils/i18n';

export default class TestEmail extends PureComponent {
  send = () => {
    const { submitForm } = this.props;

    submitForm(TEST_EMAIL_FORM);
  }

  onSubmit = (values) => {
    const { sendTestEmail, emailTarget, showTopAlert, onSave } = this.props;
    const data = {
      ...emailTarget,
      to: values.to
    };

    sendTestEmail(data).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['email.setting.tips14']
        });
        onSave();
      }
    });
  }

  render() {
    const { onClose, tenantInfo } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {i18n['email.setting.smtp.btn.send.test']}
        </Modal.Header>
        <Modal.Body>
          <TestEmailForm
            initialValues={{to: tenantInfo.tenantEmail}}
            onSubmit={this.onSubmit}>
          </TestEmailForm>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.send}>{i18n['app.btn.send']}</Button>
          <Button onClick={onClose}>{i18n['app.btn.cancel']}</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}