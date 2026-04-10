import { Icon, Button, Dialog, Form } from 'lean-ui';
import i18n from 'utils/i18n';
import ReportNameFrom, { CUSTOM_REPORT_NAME_FORM } from './form';

export default class ReportNameModal extends PureComponent {
  onSubmit = values => {
    const { onNameChange, closeModal, reportId, checkName } = this.props;
    checkName({
      id: reportId || '',
      reportName: values.name
    }).then(({ result }) => {
      if (result) {
        onNameChange(values.name);
        closeModal();
      }
    });
  };
  render() {
    const { closeModal, reportName, submitForm } = this.props;
    return (
      <Dialog
        title={i18n['general.edit']}
        visible
        onCancel={closeModal}
        footer={
          <div>
            <Button
              type="primary"
              onClick={() => submitForm(CUSTOM_REPORT_NAME_FORM)}
            >
              {i18n['general.confirm']}
            </Button>
            <Button onClick={closeModal}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <ReportNameFrom
          initialValues={{ name: reportName }}
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
