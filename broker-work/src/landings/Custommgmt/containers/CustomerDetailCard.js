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
  updatecurrentTransferContact
} from '../controls/ContactsAction';
import {
  getSalesStageList,
  getOpportunityTypeList,
  remove,
  getFormColumns as getOpportunityForm
} from '../controls/SalesOpportunityActions';

export default connect(
  ({
    show_customer_card,
    customerDetailInfo,
    customer_form_fields,
    followWayOptions,
    search_type,
    fuzzy_search_type,
    fuzzy_searchText,
    pagination_info,
    common,
    contacts,
    opportunities,
    productInfo,
    customer_link_source,
    advancedLogicType,
    date_range,
    searchDate,
    searchFieldConditions,
    searchTypes,
    currentCondition,
    currentSource
  }) => ({
    show_customer_card,
    customerDetailInfo,
    customer_form_fields,
    contactFormFields: contacts.formColumns,
    followWayOptions,
    search_type,
    fuzzy_search_type,
    fuzzy_searchText,
    pagination_info,
    userRights: common.userRights,
    userInfo: common.userInfo,
    columns: contacts.formColumns,
    contactInfo: contacts.find_contacts,
    currentTransferContact: contacts.current_transfer_contact,
    salesStageList: opportunities.salesStageList,
    opportunityTypeList: opportunities.opportunityTypeList,
    productInfo: productInfo,
    customer_link_source: customer_link_source,
    advancedLogicType,
    date_range,
    searchDate,
    searchFieldConditions,
    searchTypes,
    currentCondition,
    currentSource
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
    getOpportunityForm
  }
)(CustomerDetailCard);
