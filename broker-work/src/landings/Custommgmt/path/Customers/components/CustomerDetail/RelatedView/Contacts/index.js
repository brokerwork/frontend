import cs from './index.less';
import i18n from 'utils/i18n';
import ContentCard from '../../../../../../components/ContentCard';
import { FormattedMessage, defineMessages, injectIntl } from 'react-intl';
import { Button } from 'lean-ui';
import DropdownItem from 'components/v2/DropdownItem';
import ContactsEditModal from '../../../../../Contacts/containers/ContactsEditModal';
import ContactsAddModal from '../../../../../Contacts/containers/ContactsAddModal';
import TransferContactsModal from '../../../../../Contacts/components/TransferContactsModal';
import PhoneLink from 'components/v2/PhoneLink';

export default class Contacts extends Component {
  state = {
    showEditContactsModal: false,
    showTransferContactsModal: false,
    showAddContactsModal: false
  };

  toggleModal = (type, toggle) => {
    this.setState({
      [`show${type}Modal`]: toggle
    });
  };

  onContactClick(data) {
    const {
      findContacts,
      getContactsarticipant,
      customerDetailInfo
    } = this.props;
    findContacts(data.contactId, customerDetailInfo.enabled).then(res => {
      if (!res.result) return Promise.resolve(res);
      getContactsarticipant(res.data.customerId);
      this.toggleModal('EditContacts', true);
    });
  }
  addContact = () => {
    const { getContactsarticipant, customerDetailInfo } = this.props;
    getContactsarticipant(customerDetailInfo.customerId);
    this.toggleModal('AddContacts', true);
  };
  contactOperation = v => {
    const {
      findContacts,
      deleteContacts,
      updatecurrentTransferContact,
      masterContacts,
      showTipsModal,
      getContactsarticipant,
      showTopAlert,
      getCustomerDetail,
      customerDetailInfo
    } = this.props;
    const { type, data } = v;
    switch (type) {
      case 'edit':
        Promise.resolve(findContacts(data.contactId)).then(res => {
          if (!res.result) return Promise.resolve(res);
          getContactsarticipant(res.data.customerId);
          this.toggleModal('EditContacts', true);
        });
        break;
      case 'remove':
        let contacts = [data.contactId];
        showTipsModal({
          content: i18n['general.confirm_remove'],
          onConfirm: cb => {
            deleteContacts(contacts).then(res => {
              if (res.result) {
                showTopAlert({
                  bsStyle: 'success',
                  content: i18n['general.remove_success']
                });
                getCustomerDetail();
              }
              cb();
            });
          }
        });
        break;
      case 'transfer':
        let contactsId = [data.contactId];
        updatecurrentTransferContact(contactsId);
        this.toggleModal('TransferContacts', true);
        break;
      case 'setMaster':
        masterContacts(data.contactId).then(({ result }) => {
          if (result) {
            showTopAlert({
              bsStyle: 'success',
              content: i18n['general.set_master_success']
            });
            getCustomerDetail();
          }
        });
        break;
      default:
        break;
    }
  };

  contactsCreateOptions = o => {
    const { userRights } = this.props;
    let contactsOptions = [];

    if (userRights.CUSTOMER_CONTACTS_MODIFY) {
      contactsOptions.push(
        { label: i18n['customer.detail.edit'], type: 'edit', data: o },
        { label: i18n['customer.detail.transfer'], type: 'transfer', data: o }
      );

      if (!o.master) {
        contactsOptions.push({
          label: i18n['customer.detail.set_master'],
          type: 'setMaster',
          data: o
        });
      }
    }

    if (userRights.CUSTOMER_CONTACTS_DELETE) {
      contactsOptions.push({
        label: i18n['customer.detail.remove'],
        type: 'remove',
        data: o
      });
    }
    return contactsOptions;
  };

  //修改联系人回调
  saveContactsInfo = (info, type) => {
    const { getCustomerDetail, customerDetailInfo } = this.props;

    this.setState({
      showEditContactsModal: false,
      showAddContactsModal: false
    });
    getCustomerDetail();
  };

  //划转联系人
  transferContacts = oweId => {
    const {
      transferContacts,
      currentTransferContact,
      getCustomerDetail,
      customerDetailInfo,
      showTopAlert
    } = this.props;
    transferContacts(currentTransferContact, oweId).then(({ result }) => {
      if (result) {
        showTopAlert({
          bsStyle: 'success',
          content: i18n['general.transfer_success']
        });
        this.setState({
          showTransferContactsModal: false
        });
        getCustomerDetail();
      }
    });
  };

  render() {
    const {
      customerDetailInfo,
      customerDetailInfo: { enabled },
      contactsOfCustomer: contactList,
      userRights,
      contactInfo = {},
      columns
    } = this.props;

    const {
      showEditContactsModal,
      showAddContactsModal,
      showTransferContactsModal
    } = this.state;

    const genderIconMap = {
      male: `fa fa-male-i ${cs['gender-male']}`,
      female: `fa fa-female-i ${cs['gender-female']}`
    };

    const customerInfo = {
      customerId: customerDetailInfo.customerId,
      customName: customerDetailInfo.customName,
      oweId: customerDetailInfo.oweId,
      oweName: customerDetailInfo.oweName
    };
    return (
      <div>
        {userRights.CUSTOMER_CONTACTS ? (
          <ContentCard limit={4}>
            <ContentCard.Header
              icon="contact"
              iconClassName={cs['contact']}
              title={
                <FormattedMessage
                  id="customer.detail.contact_title"
                  defaultMessage={i18n['customer.detail.contact_title']}
                  values={{ number: `${contactList.length}` }}
                />
              }
            >
              <ContentCard.Tools>
                {userRights.CUSTOMER_CONTACTS_ADD && enabled ? (
                  <Button
                    className={cs['add-button']}
                    onClick={this.addContact}
                  >
                    {i18n['customer.detail.create']}
                  </Button>
                ) : (
                  undefined
                )}
              </ContentCard.Tools>
            </ContentCard.Header>
            <ContentCard.Body className={cs['staff-list']}>
              {contactList.map((o, index) => {
                return (
                  <div key={index} className={cs['staff-item']}>
                    <div className={cs['staff-item-container']}>
                      <div className={cs['straff-box']}>
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.name_label']}
                          </span>
                          <div className={cs['straff-name']}>
                            <a
                              href="javascript:void(0);"
                              onClick={this.onContactClick.bind(this, o)}
                              className={`${
                                cs['straff-name-label']
                              } main-color`}
                              title={o.contactsName}
                            >
                              {o.contactsName}
                            </a>
                            <div className={cs['icons']}>
                              {o.master ? (
                                <i
                                  className={`fa fa-vcard ${
                                    cs['main-contact']
                                  }`}
                                  title={i18n['customer.detail.master_contact']}
                                />
                              ) : (
                                undefined
                              )}
                              {o.gender ? (
                                <i
                                  className={
                                    genderIconMap[o.gender.toLowerCase()]
                                  }
                                  title={
                                    i18n[
                                      `customer.detail.gender_${o.gender.toLowerCase()}`
                                    ]
                                  }
                                />
                              ) : (
                                undefined
                              )}
                            </div>
                          </div>
                        </div>
                        {/* <div className={cs['staff-item-row']}>
                      <span className={cs['staff-item-label']}>
                        {i18n['customer.detail.duty_label']}
                      </span>
                      {o.duty}
                    </div> */}
                        {(o.phones && o.phones.phone) || !o.telephone ? (
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.detail.phone_label']}
                            </span>
                            {o.phones ? (
                              <PhoneLink
                                phone={o.phones.phoneStr}
                                id={o.contactId}
                                name={o.contactsName}
                                role="contact"
                              />
                            ) : (
                              ''
                            )}
                          </div>
                        ) : (
                          <div className={cs['staff-item-row']}>
                            <span className={cs['staff-item-label']}>
                              {i18n['customer.detail.tel_label']}
                            </span>
                            {o.telephone ? (
                              <PhoneLink
                                phone={o.telephone.phoneStr}
                                id={o.contactId}
                                name={o.contactsName}
                                role="contact"
                              />
                            ) : (
                              ''
                            )}
                          </div>
                        )}
                        <div className={cs['staff-item-row']}>
                          <span className={cs['staff-item-label']}>
                            {i18n['customer.detail.email_label']}
                          </span>
                          {o.email}
                        </div>
                      </div>
                      {enabled ? (
                        <DropdownItem
                          onSelect={this.contactOperation}
                          className={cs['dropdown-button']}
                          right
                          data={this.contactsCreateOptions(o)}
                        >
                          <span
                            className={`fa fa-sort-down ${cs['dropdown-icon']}`}
                          />
                        </DropdownItem>
                      ) : (
                        undefined
                      )}
                    </div>
                  </div>
                );
              })}
            </ContentCard.Body>
          </ContentCard>
        ) : (
          undefined
        )}
        {showEditContactsModal ? (
          <ContactsEditModal
            show={showEditContactsModal}
            onHide={this.toggleModal.bind(this, 'EditContacts', false)}
            uniqueContacts={contactInfo}
            onSave={this.saveContactsInfo}
            formColumns={columns}
            disabled={!enabled}
          />
        ) : (
          undefined
        )}
        {showTransferContactsModal ? (
          <TransferContactsModal
            show={showTransferContactsModal}
            onHide={this.toggleModal.bind(this, 'TransferContacts', false)}
            onSave={this.transferContacts}
          />
        ) : (
          undefined
        )}
        {showAddContactsModal ? (
          <ContactsAddModal
            show={showAddContactsModal}
            onHide={this.toggleModal.bind(this, 'AddContacts', false)}
            uniqueContacts={customerInfo}
            onSave={this.saveContactsInfo}
            formColumns={columns}
          />
        ) : (
          undefined
        )}
      </div>
    );
  }
}
