import { connect } from 'react-redux';
import OpportunityList from '../components/OpportunityList';
import { showTipsModal } from 'commonActions/actions';

import {
  getListColumns,
  getFormColumns,
  getOpportunityList,
  getDetail,
  updateCurrentPagination,
  updateSelecteds,
  getOpportunityTypeList,
  getLoseCauseList,
  getFollowWayList,
  remove
} from '../controls/actions';

export default connect(
  ({ customMgmt: { opportunities }, common }) => ({
    listColumns: opportunities.listColumns,
    opportunityList: opportunities.opportunityList,
    currentSalesStage: opportunities.currentSalesStage,
    currentFilterType: opportunities.currentFilterType,
    currentSearchType: opportunities.currentSearchType,
    currentPagination: opportunities.currentPagination,
    searchText: opportunities.searchText,
    selecteds: opportunities.selecteds,
    userRights: common.userRights,
    searchFieldConditions: opportunities.searchFieldConditions
  }),
  {
    getListColumns,
    getFormColumns,
    getOpportunityList,
    getDetail,
    updateCurrentPagination,
    updateSelecteds,
    getOpportunityTypeList,
    getLoseCauseList,
    getFollowWayList,
    showTipsModal,
    remove
  }
)(OpportunityList);
