import { Button, Dialog } from 'lean-ui';
import CustomField, { validate } from 'components/CustomField';
import { reduxForm } from 'redux-form';
import Modal from 'components/Modal';
import Dropdown from 'components/Dropdown';
import { post } from 'utils/ajax';
import i18n from 'utils/i18n';
import { setTrimString } from 'utils/trim';
import cs from './ContactsEditModal.less';
import ContactForm, { COANTACT_INFO_FORM } from '../ContactEditForm';

export default class ContactsEditModal extends PureComponent {
  state = {
    duplicateFieldsMap: {}
  };
  onSave = (info, type) => {
    const {
      editContacts,
      showTopAlert,
      onSave,
      checkDuplicateNew,
      contactFormFields
    } = this.props;
    const copyData = JSON.parse(JSON.stringify(info));
    const { contactsName, phones, email, contactId } = copyData;
    checkDuplicateNew(
      {
        name: contactsName,
        phones: phones,
        email: email
      },
      { contactFormFields, contactId, module: 'contact' }
    ).then(res => {
      editContacts(copyData).then(({ result }) => {
        if (result) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.modify_success']
          });
          if (onSave) {
            onSave(info, type);
          }
        }
      });
    });
  };
  componentDidMount() {
    const { checkDuplicateNew, uniqueContacts } = this.props;
    const { contactsName, phones, email, contactId } = uniqueContacts;
    checkDuplicateNew(
      {
        name: contactsName,
        phones: phones,
        email: email
      },
      { contactId, module: 'contact' },
      false
    ).then(res => {
      if (!res.result) return Promise.resolve(res);
      const { data } = res;
      const duplicateFieldsMap = Object.assign({}, data);
      this.setState({
        duplicateFieldsMap
      });
    });
  }
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
    const { show, onHide, userRights, disabled } = this.props;
    const { duplicateFieldsMap } = this.state;
    return (
      <Dialog
        title={i18n['customer.contacts_module.edit_contacts_title']}
        visible={show}
        onCancel={onHide}
        footer={
          <div>
            {!disabled && userRights.CUSTOMER_CONTACTS_MODIFY ? (
              <Button type="primary" onClick={this.onSubmit}>
                {i18n['general.confirm']}
              </Button>
            ) : (
              undefined
            )}
            <Button onClick={this.onCancel}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <div className={cs["form-horizontal"]}>
          <ContactForm
            disabled={disabled || !userRights.CUSTOMER_CONTACTS_MODIFY}
            duplicateFieldsMap={duplicateFieldsMap}
            {...this.props}
            onSave={this.onSave}
            type="edit"
          />
        </div>
      </Dialog>
    );
  }
}
