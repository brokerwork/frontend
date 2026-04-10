import { connect } from 'react-redux';
import * as actions from '../controls/actions';
import AddCustomerModal from '../components/AddCustomerModal';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import { submit } from 'redux-form';

export default connect(
  ({
    common,
    customMgmt: {
      contacts,
      customers: {
        customerDetailModalInfo,
        customerFormFields,
        searchType,
        fuzzySearchType,
        fuzzySearchText,
        paginationInfo,
        searchFieldConditions,
        searchDate,
        dateRange,
        currentSource,
        currentSortParam,
        currentCondition,
        customerStates,
        selectableCustomerStateKeys
      }
    }
  }) => ({
    customerDetailModalInfo,
    customerFormFields,
    searchType,
    fuzzySearchType,
    fuzzySearchText,
    paginationInfo,
    contactFormFields: contacts.formColumns,
    searchDate,
    dateRange,
    searchFieldConditions,
    currentSource,
    currentSortParam,
    currentCondition,
    customerStates,
    selectableCustomerStateKeys,
    userInfo: common.userInfo
  }),
  {
    ...actions,
    showTipsModal,
    showTopAlert,
    submitForm: submit
  }
)(AddCustomerModal);
