import i18n from 'utils/i18n';
import cs from './Leverage.less';
import LeverageModal from './Modal';
import { FormattedMessage } from 'react-intl';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
export default class Leverage extends PureComponent {
  onSave = values => {
    const {
      selectedAccountIds,
      currentServer,
      updateLeverage,
      showTopAlert,
      showTipsModal,
      onChange,
      closeModal
    } = this.props;

    updateLeverage(
      {
        accounts: selectedAccountIds,
        ...values
      },
      currentServer
    ).then(({ result, data }) => {
      if (result) {
        closeModal('leverage');
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
      currentServer,
      resources,
      submitForm,
      selectedKeys,
      modalVisible,
      isItem,
      closeModal,
      onSelect
    } = this.props;
    return (
      <div>
        {isItem ? (
          i18n['account.button.modify_leverage']
        ) : (
          <TextButton
            text={i18n['account.button.modify_leverage']}
            onClick={() => onSelect('leverage')}
          />
        )}
        {modalVisible ? (
          <LeverageModal
            visible={modalVisible}
            onSave={this.onSave}
            resources={resources}
            currentServer={currentServer}
            submitForm={submitForm}
            onHide={() => closeModal('leverage')}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
