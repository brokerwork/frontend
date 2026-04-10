import { Dialog } from 'lean-ui';
import OperateTypeForm, { OPERATE_TYPE_FORM } from './OperateTypeForm';
import i18n from 'utils/i18n';
import cs from './OperateType.less';

export default class OperateType extends PureComponent {
  onSave = () => {
    const { submitForm } = this.props;

    submitForm(OPERATE_TYPE_FORM);
  };

  onSubmit = values => {
    const {
      updateType,
      createType,
      type,
      showTopAlert,
      target,
      onSave
    } = this.props;
    const action = target ? updateType : createType;
    const newType = {
      ...values,
      regular: values.regular.trim(),
      type
    };

    action(newType).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.save_success']
        });

        if (onSave) onSave();
      }
    });
  };

  render() {
    const { onClose, type, target } = this.props;
    const title = target
      ? type === 'deposit'
        ? i18n['settings.deposit_withdraw.deposit.update']
        : i18n['settings.deposit_withdraw.withdraw.update']
      : type === 'deposit'
        ? i18n['settings.deposit_withdraw.deposit.create']
        : i18n['settings.deposit_withdraw.withdraw.create'];
    return (
      <Dialog
        visible={true}
        onCancel={onClose}
        onOk={this.onSave}
        title={title}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
        className={cs.dialog}
      >
        <OperateTypeForm initialValues={target} onSubmit={this.onSubmit} />
      </Dialog>
    );
  }
}
