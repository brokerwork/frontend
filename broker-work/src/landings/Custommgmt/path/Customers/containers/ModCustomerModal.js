import { connect } from 'react-redux';
import * as actions from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';
import ModCustomerModal from '../components/ModCustomerModal';

export default connect(
  ({
    customMgmt: {
      contacts,
      customers: {
        customerDetailModalInfo,
        customerFormFields,
        customerDetailInfo,
        paginationInfo,
        fuzzySearchText,
        fuzzySearchType,
        searchType,
        dateRange,
        searchDate,
        currentSortParam,
        currentCondition,
        searchFieldConditions,
        currentSource
      }
    }
  }) => ({
    customerDetailModalInfo,
    customerFormFields,
    customerDetailInfo,
    paginationInfo,
    fuzzySearchText,
    fuzzySearchType,
    searchType,
    dateRange,
    searchDate,
    contactFormFields: contacts.formColumns,
    currentSortParam,
    currentCondition,
    searchFieldConditions,
    currentSource
  }),
  {
    ...actions,
    showTopAlert
  }
)(ModCustomerModal);
