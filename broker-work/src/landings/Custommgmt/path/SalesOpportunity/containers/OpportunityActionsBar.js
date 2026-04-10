import { connect } from 'react-redux';
import OpportunityActionsBar from '../components/OpportunityActionsBar';
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
  remove
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
    opportunityList: opportunities.opportunityList,
    listUpdateTime: opportunities.listUpdateTime,
    searchText: opportunities.searchText,
    selecteds: opportunities.selecteds,
    userRights: common.userRights
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
    showTopAlert
  }
)(OpportunityActionsBar);
