import i18n from 'utils/i18n';
import cs from './style.less';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
import Modal from './Modal';

export default class LoginStatus extends PureComponent {
  onSave = ({ isOpen }) => {
    const {
      selectedAccountIds,
      currentServer: { vendor, serverId },
      updateCellStatus,
      showTopAlert,
      onChange,
      closeModal
    } = this.props;

    updateCellStatus(
      'readOnly',
      selectedAccountIds.join(','),
      isOpen,
      vendor,
      serverId
    ).then(({ result, data }) => {
      if (result) {
        let content = i18n['general.all_success'];
        let bsStyle = 'success';
        if (data.fail.length > 0) {
          bsStyle = 'fail';
          content = data.fail.join(',') + i18n['account.operate'];
        }
        showTopAlert({
          bsStyle,
          content
        });
        closeModal('readOnly');
        onChange();
      }
    });
  };
  render() {
    const {
      selectedKeys,
      modalVisible,
      isItem,
      closeModal,
      onSelect
    } = this.props;

    return (
      <div onClick={() => this.setState({ showModal: true })}>
        {isItem ? null : (
          <TextButton
            text={i18n['account.button.modify_readonly']}
            onClick={() => onSelect('readOnly')}
          />
        )}
        {modalVisible ? (
          <Modal
            visible={modalVisible}
            onSave={this.onSave}
            onHide={() => closeModal('readOnly')}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
