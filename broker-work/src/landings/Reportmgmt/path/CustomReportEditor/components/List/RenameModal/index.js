import { Icon, Button, Dialog, Form } from 'lean-ui';
import i18n from 'utils/i18n';
import FieldRenameFrom, { FIELD_NAME_FORM } from './form';

export default class ReportNameModal extends PureComponent {
  onSubmit = values => {
    const { name } = values;
    const {
      onFieldNameChange,
      closeModal,
      currentField,
      showTopAlert,
      columns
    } = this.props;
    const otherCols = columns.filter(
      col => col.fieldId !== currentField.fieldId
    );
    const sameName = otherCols.some(
      col => col.message === name || col.fieldName === name
    );
    if (sameName) {
      showTopAlert({
        content: i18n['report.custom_report.edit_field_rename.content']
      });
    } else {
      onFieldNameChange({ ...currentField, fieldName: name });
      closeModal();
    }
  };
  render() {
    const { closeModal, submitForm, currentField } = this.props;
    return (
      <Dialog
        title={i18n['general.edit']}
        visible
        onCancel={closeModal}
        footer={
          <div>
            <Button type="primary" onClick={() => submitForm(FIELD_NAME_FORM)}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={closeModal}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <FieldRenameFrom
          initialValues={{
            name: currentField.fieldName || currentField.message
          }}
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
