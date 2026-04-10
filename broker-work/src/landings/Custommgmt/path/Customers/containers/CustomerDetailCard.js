import { connect } from 'react-redux';
import CustomerDetailCard from '../components/CustomerDetailCard';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import {
  getFormColumns,
  findContacts,
  deleteContacts,
  masterContacts,
  addContacts,
  editContacts,
  transferContacts,
  updatecurrentTransferContact,
  getCustomerParticipant as getContactsarticipant
} from '../../Contacts/controls/actions';
import {
  getSalesStageList,
  getOpportunityTypeList,
  remove,
  getFormColumns as getOpportunityForm,
  getCustomerParticipant
} from '../../SalesOpportunity/controls/actions';

export default connect(
  ({
    common,
    customMgmt: {
      contacts,
      opportunities,
      customers: {
        showCustomerCard,
        customerDetailInfo,
        customerFormFields,
        followWayOptions,
        searchType,
        fuzzySearchType,
        fuzzySearchText,
        paginationInfo,
        productInfo,
        customerLinkSource,
        advancedLogicType,
        dateRange,
        searchDate,
        searchFieldConditions,
        currentSortParam,
        currentSource,
        currentCondition
      }
    }
  }) => ({
    showCustomerCard,
    customerDetailInfo,
    customerFormFields,
    contactFormFields: contacts.formColumns,
    followWayOptions,
    searchType,
    fuzzySearchType,
    fuzzySearchText,
    paginationInfo,
    userRights: common.userRights,
    userInfo: common.userInfo,
    columns: contacts.formColumns,
    contactInfo: contacts.find_contacts,
    currentTransferContact: contacts.current_transfer_contact,
    salesStageList: opportunities.salesStageList,
    opportunityTypeList: opportunities.opportunityTypeList,
    productInfo: productInfo,
    customerLinkSource: customerLinkSource,
    advancedLogicType,
    dateRange,
    searchDate,
    searchFieldConditions,
    currentSortParam,
    currentSource,
    currentCondition,
    customerParticipant: opportunities.customerParticipant,
    phoneCallStatus: common.phoneCallStatus
  }),
  {
    ...actions,
    showTopAlert,
    showTipsModal,
    getFormColumns,
    findContacts,
    getSalesStageList,
    getOpportunityTypeList,
    deleteContacts,
    masterContacts,
    addContacts,
    editContacts,
    transferContacts,
    updatecurrentTransferContact,
    removeOpportunity: remove,
    getOpportunityForm,
    getCustomerParticipant,
    getContactsarticipant
  }
)(CustomerDetailCard);
