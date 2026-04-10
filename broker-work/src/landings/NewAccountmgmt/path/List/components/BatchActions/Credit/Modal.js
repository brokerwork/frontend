import { Button } from 'react-bootstrap';
import i18n from 'utils/i18n';
import Form, { CREDIT_FORM } from './Form';
import { Dialog } from 'lean-ui';
export default class CreditModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;

    submitForm(CREDIT_FORM);
  };

  onSubmit = values => {
    const { onSave } = this.props;

    onSave(values);
  };

  render() {
    const { onHide, visible } = this.props;

    return (
      <Dialog
        visible={visible}
        ttile={i18n['account.button.credit']}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <Form
          initialValues={{ sendEmail: 1, type: 'CREDIT_IN' }}
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
