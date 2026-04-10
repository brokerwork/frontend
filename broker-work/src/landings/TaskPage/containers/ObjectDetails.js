import { connect } from 'react-redux';
import ObjectDetail from '../components/ObjectDetails';
import {
  getObjectTaskGroups,
  getTaskGroupTasks,
  getTheTask,
  modifyParams,
  selectTask,
  cleanTasks,
  getUserAgentFormColumns,
  refreshTasks,
  getTaRight,
  getIsAdaptOn,
  batchClaimTask,
  batchRejectTask
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ taskmgmt, common }) => ({
    objectList: taskmgmt.object_list,
    objectDetails: taskmgmt.objectDetails,
    taskGroupTasks: taskmgmt.taskGroupTasks,
    searchParams: taskmgmt.searchParams,
    paginationInfo: taskmgmt.paginationInfo,
    currentLoginUserInfo: common.userInfo,
    selectedTasks: taskmgmt.selectedTasks,
    depositCategoryId: taskmgmt.depositCategoryId,
    taskType: taskmgmt.taskType,
    categoryIdDetailMap: taskmgmt.categoryIdDetailMap,
    userAgentColumns: taskmgmt.userAgentColumns,
    taRight: taskmgmt.taRight,
    extrasTotalInfo: taskmgmt.extrasTotalInfo
  }),
  {
    getObjectTaskGroups,
    getTaskGroupTasks,
    getTheTask,
    showTopAlert,
    modifyParams,
    selectTask,
    cleanTasks,
    getUserAgentFormColumns,
    refreshTasks,
    getTaRight,
    getIsAdaptOn,
    showTipsModal,
    batchClaimTask,
    batchRejectTask
  }
)(ObjectDetail);
