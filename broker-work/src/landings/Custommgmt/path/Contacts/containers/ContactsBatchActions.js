import { connect } from 'react-redux';
import ContactsBatchActions from '../components/ContactsBatchActions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import {
  getContactsList,
  deleteContacts,
  transferContacts,
  getCustomerList,
  updateSelectedContacts
} from '../controls/actions';

export default connect(
  ({ customMgmt: { contacts }, common }) => {
    return {
      currentPrivilegeType: contacts.current_privilege_type,
      fuzzyItem: contacts.fuzzy_item,
      fuzzyVal: contacts.fuzzy_value,
      customerList: contacts.customer_list,
      selectedContactsIds: contacts.selected_contact_ids,
      currentPage: contacts.currentPagination,
      userRights: common.userRights
    };
  },
  {
    getContactsList,
    deleteContacts,
    showTopAlert,
    getCustomerList,
    showTipsModal,
    transferContacts,
    updateSelectedContacts
  }
)(ContactsBatchActions);
