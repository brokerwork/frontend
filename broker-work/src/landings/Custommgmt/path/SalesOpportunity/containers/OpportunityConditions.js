import { connect } from 'react-redux';
import OpportunityConditions from '../components/OpportunityConditions';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import {
  getOpportunityList,
  getSalesStageList,
  getSearchTypeList,
  updateCurrentFilterType,
  updateCurrentSalesStage,
  updateCurrentSearchType,
  updateSearchText,
  updateSelecteds,
  remove,
  updateFieldConditions
} from '../controls/actions';

export default connect(
  ({ customMgmt: { opportunities }, common }) => ({
    salesStageList: opportunities.salesStageList,
    filterTypeList: opportunities.filterTypeList,
    searchTypeList: opportunities.searchTypeList,
    currentSalesStage: opportunities.currentSalesStage,
    currentFilterType: opportunities.currentFilterType,
    currentSearchType: opportunities.currentSearchType,
    currentPagination: opportunities.currentPagination,
    searchText: opportunities.searchText,
    selecteds: opportunities.selecteds,
    userRights: common.userRights,
    advancedSearchTypes: opportunities.advancedSearchTypes,
    searchFieldConditions: opportunities.searchFieldConditions
  }),
  {
    getOpportunityList,
    getSalesStageList,
    getSearchTypeList,
    updateCurrentFilterType,
    updateCurrentSalesStage,
    updateCurrentSearchType,
    updateSearchText,
    updateSelecteds,
    remove,
    showTipsModal,
    showTopAlert,
    updateFieldConditions
  }
)(OpportunityConditions);
