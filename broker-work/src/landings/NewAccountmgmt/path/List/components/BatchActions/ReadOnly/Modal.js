import { Dialog, Radio } from 'lean-ui';
import i18n from 'utils/i18n';
import cs from './style.less';

export default class ReadOnlyStatusModal extends PureComponent {
  state = {
    isOpen: '1'
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
        title={i18n['account.modify_readonly.modal_title']}
        visible={visible}
        onCancel={onHide}
        onOk={this.onSave}
        okText={i18n['general.apply']}
        cancelText={i18n['general.cancel']}
      >
        <Radio.Group name="isOpen" value={isOpen} onChange={this.onChange}>
          <Radio value="1">{i18n['general.open']}</Radio>
          <Radio value="0">{i18n['general.close']}</Radio>
        </Radio.Group>
      </Dialog>
    );
  }
}
