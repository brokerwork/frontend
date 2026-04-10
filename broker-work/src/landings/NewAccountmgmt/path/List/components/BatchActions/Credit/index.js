import Modal from './Modal';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
export default class Credit extends PureComponent {
  onSave = values => {
    const {
      updateBalance,
      currentServer,
      selectedAccountIds,
      showTopAlert,
      showTipsModal,
      onChange,
      closeModal
    } = this.props;

    updateBalance(
      {
        accountId: selectedAccountIds,
        ...values
      },
      currentServer
    ).then(({ result, data }) => {
      if (result) {
        closeModal('credit');
        if (data.success.length === selectedAccountIds.length) {
          showTopAlert({
            bsStyle: 'success',
            content: i18n['general.all_success']
          });
          onChange();
        } else {
          showTipsModal({
            content: (
              <FormattedMessage
                id="general.batch.tips"
                defaultMessage={i18n['general.batch.tips']}
                values={{ accounts: data.fail.join(i18n['general.stop']) }}
              />
            ),
            onConfirm: cb => {
              onChange();
              cb();
            },
            noCancel: true
          });
        }
      }
    });
  };
  render() {
    const {
      submitForm,
      selectedKeys,
      modalVisible,
      isItem,
      closeModal,
      onSelect
    } = this.props;
    return (
      <div onClick={() => this.setState({ showModal: true })}>
        {isItem ? (
          i18n['account.button.credit']
        ) : (
          <TextButton
            text={i18n['account.button.credit']}
            onClick={() => onSelect('credit')}
          />
        )}
        {modalVisible ? (
          <Modal
            visible={modalVisible}
            submitForm={submitForm}
            onHide={() => closeModal('credit')}
            onSave={this.onSave}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
