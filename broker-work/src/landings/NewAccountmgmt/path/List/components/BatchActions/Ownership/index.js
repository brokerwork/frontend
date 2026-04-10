import i18n from 'utils/i18n';
import cs from './Ownership.less';
import OwnershipModal from './Modal';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
export default class Ownership extends PureComponent {
  onSave = ({ id: userId, name: userName }) => {
    const {
      selectedAccountIds,
      currentServer,
      updateOwnership,
      showTopAlert,
      onChange,
      closeModal
    } = this.props;

    updateOwnership(
      {
        accounts: selectedAccountIds,
        userId,
        userName
      },
      currentServer
    ).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.all_success']
        });
        closeModal('ownership');
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
        {isItem ? (
          i18n['general.transfer']
        ) : (
          <TextButton
            text={i18n['account.button.modify_ownership']}
            onClick={() => onSelect('ownership')}
          />
        )}
        {modalVisible ? (
          <OwnershipModal
            visible={modalVisible}
            onSave={this.onSave}
            onHide={() => closeModal('ownership')}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
