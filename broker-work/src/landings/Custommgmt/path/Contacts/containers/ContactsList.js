import { connect } from 'react-redux';
import ContactsList from '../components/ContactsList';
import { showTopAlert } from 'commonActions/actions';
import {
  getListColumns,
  getFormColumns,
  getContactsList,
  getCustomerList,
  updatePagination,
  editContacts,
  updateSelectedContacts,
  updateEidtContactsInfo,
  findContacts,
  getCustomerParticipant
} from '../controls/actions';
import { checkDuplicateNew } from '../../Customers/controls/actions';
export default connect(
  ({ customMgmt: { contacts, customers }, common }) => {
    return {
      currentPrivilegeType: contacts.current_privilege_type,
      searchType: contacts.search_type,
      fuzzyItem: contacts.fuzzy_item,
      fuzzyVal: contacts.fuzzy_value,
      listColumns: contacts.listColumns,
      contactsList: contacts.contacts_list,
      customerList: contacts.customer_list,
      currentPagination: contacts.currentPagination,
      selectedContacts: contacts.selected_contacts,
      selectedContactsIds: contacts.selected_contact_ids,
      currentPage: contacts.currentPagination,
      userRights: common.userRights,
      customerFormFields: customers.customer_form_fields,
      contactFormFields: contacts.formColumns,
      uniqueContacts: contacts.find_contacts
    };
  },
  {
    getListColumns,
    getFormColumns,
    getContactsList,
    getCustomerList,
    showTopAlert,
    editContacts,
    updateEidtContactsInfo,
    updateSelectedContacts,
    updatePagination,
    findContacts,
    checkDuplicateNew,
    getCustomerParticipant
  }
)(ContactsList);
