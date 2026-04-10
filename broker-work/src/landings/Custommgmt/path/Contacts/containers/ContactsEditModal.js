import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ContactsEditModal from '../components/ContactsEditModal';
import {
  editContacts,
  getContactsList,
  getCustomerParticipant
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { checkDuplicateNew } from '../../Customers/controls/actions';

export default connect(
  ({ customMgmt: { contacts }, common }) => {
    return {
      currentPrivilegeType: contacts.current_privilege_type,
      searchType: contacts.search_type,
      fuzzyItem: contacts.fuzzy_item,
      fuzzyVal: contacts.fuzzy_value,
      listColumns: contacts.listColumns,
      customerList: contacts.customer_list,
      currentPagination: contacts.currentPagination,
      formColumns: contacts.formColumns,
      editContactsInfo: contacts.edit_contacts_info,
      userRights: common.userRights,
      customerParticipant: contacts.customerParticipant,
      contactFormFields: contacts.formColumns
    };
  },
  {
    editContacts,
    submitForm: submit,
    getContactsList,
    getCustomerParticipant,
    showTopAlert,
    checkDuplicateNew
  }
)(ContactsEditModal);
