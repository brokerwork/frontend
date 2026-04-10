import Modal from './Modal';
import i18n from 'utils/i18n';
import { FormattedMessage } from 'react-intl';
import TextButton from 'components/v2/TextButton';
import { Menu } from 'lean-ui';
import rcs from './../style.less';
export default class Group extends PureComponent {
  onSave = values => {
    const {
      selectedAccountIds,
      showTopAlert,
      showTipsModal,
      updateGroup,
      currentServer,
      onChange,
      closeModal
    } = this.props;
    updateGroup(
      {
        accounts: selectedAccountIds,
        ...values
      },
      currentServer
    ).then(({ result, data }) => {
      if (result) {
        closeModal('group');
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
      resources,
      currentServer,
      submitForm,
      filteredRights,
      selectedKeys,
      modalVisible,
      isItem,
      closeModal,
      onSelect
    } = this.props;
    return (
      <div>
        {isItem ? (
          i18n['account.modify_group.modal_title']
        ) : (
          <TextButton
            text={i18n['account.modify_group.modal_title']}
            onClick={() => onSelect('group')}
          />
        )}
        {modalVisible ? (
          <Modal
            visible={modalVisible}
            filteredRights={filteredRights}
            resources={resources}
            currentServer={currentServer}
            submitForm={submitForm}
            onHide={() => closeModal('group')}
            onSave={this.onSave}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
