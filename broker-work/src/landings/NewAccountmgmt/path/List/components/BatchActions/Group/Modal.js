import { Dialog } from 'lean-ui';
import i18n from 'utils/i18n';
import Form, { GROUP_FORM } from './Form';

export default class GroupModal extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;

    submitForm(GROUP_FORM);
  };

  onSubmit = values => {
    const { onSave } = this.props;

    onSave(values);
  };

  render() {
    const {
      onHide,
      resources,
      currentServer,
      filteredRights,
      visible
    } = this.props;

    return (
      <Dialog
        title={i18n['account.modify_group.modal_title']}
        visible={visible}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <Form
          filteredRights={filteredRights}
          resources={resources}
          currentServer={currentServer}
          onSubmit={this.onSubmit}
        />
      </Dialog>
    );
  }
}
