import { Icon, Button, Dialog, Form } from 'lean-ui';
import i18n from 'utils/i18n';
import UserRangeForm, { USER_RANGE_FORM } from './form';

export default class ReportNameModal extends PureComponent {
  onSubmit = values => {
    const { onUserRangeChange, closeModal } = this.props;
    onUserRangeChange(values);
    closeModal();
  };
  render() {
    const { closeModal, submitForm, userRange } = this.props;
    return (
      <Dialog
        title={i18n['report.custom_report.edit.user_range']}
        visible
        onCancel={closeModal}
        footer={
          <div>
            <Button type="primary" onClick={() => submitForm(USER_RANGE_FORM)}>
              {i18n['general.confirm']}
            </Button>
            <Button onClick={closeModal}>{i18n['general.cancel']}</Button>
          </div>
        }
      >
        <UserRangeForm initialValues={userRange} onSubmit={this.onSubmit} />
      </Dialog>
    );
  }
}
