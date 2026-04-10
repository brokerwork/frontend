import { connect } from 'react-redux';
import Conditions from '../components/Conditions';
import {
  cleanTasks,
  batchRejectTask,
  batchClaimTask,
  updateFieldConditions
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    taskmgmt: {
      objectDetails: { categorys },
      searchParams,
      depositCategoryId,
      selectedTasks,
      taskType,
      categoryIdDetailMap,
      advancedSearchConditions,
      selectedConditions
    },
    common: { userRights }
  }) => ({
    userRights,
    categorys,
    params: searchParams,
    depositCategoryId,
    selectedTasks,
    taskType,
    categoryIdDetailMap,
    advancedSearchConditions,
    selectedConditions
  }),
  {
    showTopAlert,
    showTipsModal,
    cleanTasks,
    batchRejectTask,
    batchClaimTask,
    updateFieldConditions
  }
)(Conditions);
