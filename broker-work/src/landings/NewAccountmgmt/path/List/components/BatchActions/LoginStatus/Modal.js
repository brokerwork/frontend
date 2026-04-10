import { Dialog, Radio } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './style.less';

export default class LoginStatusModal extends PureComponent {
  state = {
    isOpen: true
  };
  onSave = () => {
    const { onSave } = this.props;
    const { isOpen } = this.state;
    onSave({ isOpen });
  };
  onChange = val => {
    this.setState({
      isOpen: val
    });
  };

  render() {
    const { onHide, visible } = this.props;
    const { isOpen } = this.state;
    return (
      <Dialog
        title={i18n['account.modify_enable.modal_title']}
        visible={visible}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <Radio.Group name="isOpen" value={isOpen} onChange={this.onChange}>
          <Radio value={true}>{i18n['general.open']}</Radio>
          <Radio value={false}>{i18n['general.close']}</Radio>
        </Radio.Group>
      </Dialog>
    );
  }
}
