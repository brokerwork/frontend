import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';
import {
  cleanTasks,
  batchRejectTask,
  batchClaimTask,
  refreshTasks,
  exportTask,
  updateFuzzySearchText
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';
import { getWithdrawFormField } from '../controls/TaskDetailsActions';

export default connect(
  ({
    taskmgmt: {
      objectDetails: { categorys },
      searchParams,
      depositCategoryId,
      selectedTasks,
      taskType,
      categoryIdDetailMap,
      paginationInfo,
      listUpdateTime,
      taskDetails: { withdrawFormField }
    },
    common: { userRights }
  }) => ({
    categorys,
    params: searchParams,
    depositCategoryId,
    selectedTasks,
    taskType,
    categoryIdDetailMap,
    paginationInfo,
    listUpdateTime,
    userRights,
    withdrawFormField
  }),
  {
    showTopAlert,
    showTipsModal,
    cleanTasks,
    batchRejectTask,
    batchClaimTask,
    refreshTasks,
    getWithdrawFormField,
    exportTask,
    updateFuzzySearchText
  }
)(ActionBar);
