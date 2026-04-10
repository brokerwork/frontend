import { Button, Dialog } from 'lean-ui';
import i18n from 'utils/i18n';
import ContactForm, { COANTACT_INFO_FORM } from '../ContactEditForm';
import cs from './ContactsAddModal.less';
export default class ContactsAddModal extends PureComponent {
  onSave = (info, type) => {
    const {
      addContacts,
      showTopAlert,
      onSave,
      checkDuplicateNew,
      contactFormFields
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(info));
    const { contactsName, phones, email } = copyData;
    checkDuplicateNew(
      {
        name: contactsName,
        phones: phones,
        email: email
      },
      { contactFormFields, module: 'contact' }
    ).then(res => {
      addContacts(info).then(({ result }) => {
        if (result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.create_success']
          });
          if (onSave) {
            onSave(info, type);
          }
        }
      });
    });
  };
  //保存数据
  onSubmit = () => {
    const { submitForm } = this.props;
    submitForm(COANTACT_INFO_FORM);
  };

  onCancel = () => {
    const { onHide } = this.props;
    if (onHide) onHide();
  };

  render() {
    const { show, userRights } = this.props;
    return (
      <Dialog
        title={i18n['customer.contacts_module.edit_contacts_title']}
        visible={show}
        onCancel={this.onCancel}
        footer={
          <div>
            <Button type="primary" onClick={this.onSubmit}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className={cs["form-horizontal"]}>
          <ContactForm
            {...this.props}
            onSave={this.onSave}
            type="add"
            className={cs['concat-form']}
          />
        </div>
      </Dialog>
    );
  }
}
