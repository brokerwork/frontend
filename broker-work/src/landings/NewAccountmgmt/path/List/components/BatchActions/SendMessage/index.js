import i18n from 'utils/i18n';
import UserSelect from 'components/UserSelector';
import cs from './transferCustomer.less';
import SendMessageModal from './modal';
import TextButton from 'components/v2/TextButton';

export default class SendMessage extends PureComponent {
  render() {
    const {
      isItem,
      modalVisible,
      selectedAccountIds,
      onSelect,
      closeModal,
      sendMsgCheck,
      showTopAlert,
      currentServer,
      showTipsModal,
      filteredRights
    } = this.props;
    return (
      <div>
        {isItem ? (
          i18n['account.button.sendMsg']
        ) : (
          <TextButton
            text={i18n['account.button.sendMsg']}
            onClick={() => onSelect('sendMsg')}
          />
        )}
        {modalVisible ? (
          <SendMessageModal
            visible={modalVisible}
            onSave={this.onSave}
            onHide={() => closeModal('sendMsg')}
            showTopAlert={showTopAlert}
            sendMsgCheck={sendMsgCheck}
            selectedAccountIds={selectedAccountIds}
            currentServer={currentServer}
            showTipsModal={showTipsModal}
            filteredRights={filteredRights}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
