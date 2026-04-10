import Modal from './Modal';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
export default class Balance extends PureComponent {
  state = {
    submitDisable: false
  };
  onSave = values => {
    this.setState({
      submitDisable: true
    });
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
      this.setState({
        submitDisable: false
      });
      if (result) {
        closeModal('balance');
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

  onImport = (previewData, sendEmail, importType) => {
    const { runDepositExcel, showTipsModal, cancel } = this.props;
    runDepositExcel(previewData.id, sendEmail).then(({ result }) => {
      if (result) {
        showTipsModal({
          content:
            importType === 'deposit'
              ? i18n['account.batch_deposit.import_success']
              : i18n['account.batch_widthdraw.import_success'],
          noCancel: true,
          confirmBtnText: i18n['general.go_now'],
          onConfirm: cb => {
            cb();
            if (importType === 'deposit') {
              window.open('/deposit', '_blank');
            } else {
              window.open('/batchWithdraw', '_blank');
            }
          }
        });

        cancel();
      }
    });
  };
  render() {
    const {
      submitForm,
      currentServer,
      selectedKeys,
      modalVisible,
      isItem,
      closeModal,
      onSelect,
      filteredRights
    } = this.props;
    const { submitDisable } = this.state;
    return (
      <div>
        {isItem ? (
          i18n['account.button.money']
        ) : (
          <TextButton
            text={i18n['account.button.money']}
            onClick={() => onSelect('balance')}
          />
        )}
        {modalVisible ? (
          <Modal
            visible={modalVisible}
            submitForm={submitForm}
            currentServer={currentServer}
            onHide={() => closeModal('balance')}
            onSave={this.onSave}
            onImport={this.onImport}
            filteredRights={filteredRights}
            submitDisable={submitDisable}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
