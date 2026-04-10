import Modal from 'components/Modal';
import Button from 'components/Button';
import ContactForm, { CONTACT_FORM } from '../Forms/Contact';
import { getTenantId } from 'utils/tenantInfo';
import i18n from 'utils/i18n';

export default class OperateContact extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;

    submitForm(CONTACT_FORM);
  }

  onSubmit = (values) => {
    const { operateContact, showTopAlert, info, onSave } = this.props;
    const tenantId = getTenantId();
    const data = Object.assign({}, info, values);

    operateContact(tenantId, data).then(({ result }) => {
      if (result) {
        showTopAlert({
          style: 'success',
          content: i18n['general.save_success']
        });
        onSave();
      }
    });
  }

  render() {
    const { onClose, info } = this.props;

    return (
      <Modal onClose={onClose}>
        <Modal.Header>
          {info.contactsId
            ? i18n['dashboard.contacts.edit']
            : i18n['dashboard.contacts.add']}
        </Modal.Header>
        <Modal.Body>
          <ContactForm
            initialValues={info}
            onSubmit={this.onSubmit}
          ></ContactForm>
        </Modal.Body>
        <Modal.Footer>
          <Button style="primary" onClick={this.onSave}>
            {i18n['general.save']}
          </Button>
          <Button onClick={onClose}>
            {i18n['general.cancel']}
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }
}