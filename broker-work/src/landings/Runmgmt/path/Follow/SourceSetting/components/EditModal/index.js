import i18n from 'utils/i18n';
import { Message, Button, Dialog } from 'lean-ui';
import EditForm, { EDIT_SOURCE_FORM } from './form';

export default class EditModal extends PureComponent {
  onConfirm = () => {
    const { submitForm } = this.props;
    submitForm(EDIT_SOURCE_FORM);
  };
  onSubmit = datas => {
    const { source, onClose, resetForm, editSource } = this.props;

    editSource({
      serverId: source.serverId,
      tradeId: source.tradeId,
      ...datas
    }).then(res => {
      if (res.result) {
        Message.success(i18n['runmgmt.source_setting.edit.success']);
        resetForm(EDIT_SOURCE_FORM);
        onClose();
      } else {
        Message.error(i18n['runmgmt.source_setting.edit.fail']);
      }
    });
  };

  render() {
    const { onClose, className = '', source } = this.props;
    return (
      <Dialog
        title={i18n['runmgmt.source_setting.strategy.edt.title']}
        visible={true}
        onCancel={onClose}
        footer={
          <Button onClick={this.onConfirm} type="primary">
            {i18n['tipsmodal.confirm']}
          </Button>
        }
      >
        <EditForm onSubmit={this.onSubmit} initialValues={source} />
      </Dialog>
    );
  }
}
