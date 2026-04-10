import { connect } from 'react-redux';
import ContactsActionBar from '../components/ContactsActionBar';
import { showTopAlert } from 'commonActions/actions';
import {
  getPrivilegeType,
  getListColumns,
  updateCurrentPrivilegeType,
  setSearchType,
  updateSearchType,
  updateSearchText,
  getContactsList,
  getCustomerList,
  deleteContacts,
  updatePagination
} from '../controls/actions';

export default connect(
  ({ customMgmt: { contacts }, common }) => {
    return {
      privilegetype: contacts.privilege_type,
      currentPrivilegeType: contacts.current_privilege_type,
      searchType: contacts.search_type,
      fuzzyItem: contacts.fuzzy_item,
      fuzzyVal: contacts.fuzzy_value,
      listColumns: contacts.listColumns,
      contactsList: contacts.contacts_list,
      customerList: contacts.customer_list,
      selectedContactIds: contacts.selected_contact_ids,
      currentPage: contacts.currentPagination,
      userRights: common.userRights
    };
  },
  {
    getPrivilegeType,
    getListColumns,
    updateCurrentPrivilegeType,
    setSearchType,
    updateSearchType,
    updateSearchText,
    getContactsList,
    deleteContacts,
    getCustomerList,
    showTopAlert,
    updatePagination
  }
)(ContactsActionBar);
