import { connect } from 'react-redux';
import CustomerDetailCard from '../components/CustomerDetail';
import * as actions from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { submit, reset } from 'redux-form';

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

import {
  getProductList,
  removeContract
} from '../../Contracts/controls/actions';

import { removeBill } from '../../Bills/controls/actions';

import { resetCustomer, destroyCustomer } from '../path/Trash/controls/actions';

export default connect(
  ({
    common,
    customMgmt: {
      contracts,
      contacts,
      opportunities,
      customers: {
        showCustomerCard,
        customerDetailInfo,
        bwBindUserDirectCount,
        unBindBwUserDirectUserCount,
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
        currentCondition,
        customerStates,
        contactsOfCustomer,
        contractListOfCustomer,
        opportunitiesOfCustomer,
        accountsOfCustomer,
        customerActivitiesAll,
        customerActivitiesOperate,
        customerActivitiesTrade,
        customerActivitiesFollow,
        twUserOfCustomer,
        billListOfCustomer,
        deployListOfCustomer,
        accountOwnerInfo,
        accountOwnerFormColumns,
        tenantType,
        selectableCustomerStateKeys,
        isAdaptOn
      }
    }
  }) => ({
    showCustomerCard,
    customerDetailInfo,
    bwBindUserDirectCount,
    unBindBwUserDirectUserCount,
    customerFormFields,
    contactFormFields: contacts.formColumns,
    opportunityFormFields: opportunities.formColumns,
    customerFormFieldsMap: fieldArrayToMap(customerFormFields),
    contactFormFieldsMap: fieldArrayToMap(contacts.formColumns),
    opportunityFormFieldsMap: fieldArrayToMap(opportunities.formColumns),
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
    productList: contracts.productList,
    phoneCallStatus: common.phoneCallStatus,
    customerStates,
    contactsOfCustomer,
    contractListOfCustomer,
    opportunitiesOfCustomer,
    accountsOfCustomer,
    customerActivitiesAll,
    customerActivitiesOperate,
    customerActivitiesTrade,
    customerActivitiesFollow,
    twUserOfCustomer,
    billListOfCustomer,
    deployListOfCustomer,
    accountOwnerInfo,
    accountOwnerFormColumns,
    tenantType,
    selectableCustomerStateKeys,
    isAdaptOn,
    versionRights: common.versionRights
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
    getContactsarticipant,
    getProductList,
    removeContract,
    removeBill,
    resetCustomer,
    destroyCustomer,
    submitForm: submit,
    resetForm: reset
  }
)(CustomerDetailCard);

function fieldArrayToMap(array) {
  return array.reduce((map, item) => {
    map[item.key] = item;
    return map;
  }, {});
}
