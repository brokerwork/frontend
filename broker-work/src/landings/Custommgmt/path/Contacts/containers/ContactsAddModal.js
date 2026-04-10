import { connect } from 'react-redux';
import { submit } from 'redux-form';
import ContactsAddModal from '../components/ContactsAddModal';
import {
  addContacts,
  getContactsList,
  getCustomerParticipant
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import { checkDuplicateNew } from '../../Customers/controls/actions';

export default connect(
  ({ common, customMgmt: { contacts, customers } }) => {
    return {
      currentPrivilegeType: contacts.current_privilege_type,
      searchType: contacts.search_type,
      fuzzyItem: contacts.fuzzy_item,
      fuzzyVal: contacts.fuzzy_value,
      listColumns: contacts.listColumns,
      customerList: contacts.customer_list,
      currentPagination: contacts.currentPagination,
      formColumns: contacts.formColumns,
      customerDetailInfo: customers.customerDetailInfo,
      userRights: common.userRights,
      customerParticipant: contacts.customerParticipant,
      contactFormFields: contacts.formColumns
    };
  },
  {
    addContacts,
    submitForm: submit,
    getContactsList,
    getCustomerParticipant,
    showTopAlert,
    checkDuplicateNew
  }
)(ContactsAddModal);
