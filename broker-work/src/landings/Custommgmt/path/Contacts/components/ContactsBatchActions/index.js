import { Button } from 'lean-ui';
import i18n from 'utils/i18n';
import TransferContactsModal from '../TransferContactsModal';
import { FormattedMessage } from 'react-intl';
import cs from './ContactsBatchActions.less';

export default class ContactsBatchActions extends PureComponent {
  state = {
    showTransferModal: false
  };

  //展示划转联系人的modal
  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  getContactsList = () => {
    const {
      getContactsList,
      fuzzyItem,
      fuzzyVal,
      currentPrivilegeType,
      currentPage
    } = this.props;
    getContactsList({
      filterType: currentPrivilegeType.value,
      fuzzyItem: fuzzyItem.value,
      fuzzyVal: fuzzyVal,
      currentPage: currentPage.pageNo,
      pageSize: currentPage.pageSize
    });
  };

  cancel = () => {
    this.resetSelectedCantacts();
  };

  resetSelectedCantacts = () => {
    const { updateSelectedContacts } = this.props;

    updateSelectedContacts([]);
  };

  //批量划转联系人
  transferContacts = oweId => {
    const { transferContacts, selectedContactsIds, showTopAlert } = this.props;
    transferContacts(selectedContactsIds, oweId).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.transfer_success']
        });
        this.toggleModal.bind(this, 'Transfer', false);
        this.resetSelectedCantacts();
        this.getContactsList();
      }
    });
  };

  //批量删除联系人
  removeContact = contacts => {
    const {
      deleteContacts,
      showTopAlert,
      showTipsModal,
      selectedContactsIds
    } = this.props;
    showTipsModal({
      content: i18n['general.confirm_remove'],
      onConfirm: cb => {
        deleteContacts(selectedContactsIds).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.remove_success']
            });
            this.resetSelectedCantacts();
            this.getContactsList();
          }
          cb();
        });
      }
    });
  };

  render() {
    const { selectedContactsIds, userRights, customerList } = this.props;
    const { showTransferModal } = this.state;

    return (
      <div className={cs['wrapper']}>
        <div className={cs['text']}>
          <FormattedMessage
            id="customer.contacts.selected_tips"
            defaultMessage={i18n['customer.contacts_module.selected_tips']}
            values={{
              number: (
                <span className="badge main-color">
                  {selectedContactsIds.length}
                </span>
              )
            }}
          />
        </div>
        <Button type="primary" className={cs['btn']} onClick={this.cancel}>
          {i18n['account.button.cancel']}
        </Button>
        {userRights.CUSTOMER_CONTACTS_MODIFY ? (
          <Button
            type="primary"
            className={cs['btn']}
            onClick={this.toggleModal.bind(this, 'Transfer', true)}
          >
            {i18n['customer.contacts_module.transfer']}
          </Button>
        ) : (
          undefined
        )}
        {userRights.CUSTOMER_CONTACTS_DELETE ? (
          <Button
            type="primary"
            className={cs['btn']}
            onClick={this.removeContact}
          >
            {i18n['customer.contacts_module.delete_customer']}
          </Button>
        ) : (
          undefined
        )}
        {showTransferModal ? (
          <TransferContactsModal
            show={showTransferModal}
            onHide={this.toggleModal.bind(this, 'Transfer', false)}
            leverageList={customerList}
            onSave={this.transferContacts}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
