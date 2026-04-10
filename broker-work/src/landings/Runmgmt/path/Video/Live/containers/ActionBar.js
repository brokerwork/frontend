import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';

import {
  getLives,
  createLive,
  createLecturer,
  getLecturers,
  modifySearchParams,
  getLecturerList,
  saveListType,
  deleteLive,
  updateSelectedLive,
  modifyParams,
  getTaUsers,
  updateAdmin,
  getAdminList,
  updateTausers,
  stopLive
} from '../controls/actions';

import { showTipsModal } from 'commonActions/actions';

export default connect(
  ({ runmgmt: { videoLive }, common: { userRights } }) => {
    return {
      data: videoLive.lives,
      searchParams: videoLive.searchParams,
      lecturers: videoLive.lecturers,
      listType: videoLive.listType,
      selectedLiveIds: videoLive.selectedLiveIds,
      selectedLives: videoLive.selectedLives,
      taUsers: videoLive.taUsers,
      taParams: videoLive.taParams,
      searchTypes: videoLive.searchTypes,
      adminList: videoLive.adminList,
      tenantRights: videoLive.tenantRights,
      userRights
    };
  },
  {
    getLives,
    createLive,
    createLecturer,
    getLecturers,
    modifySearchParams,
    getLecturerList,
    saveListType,
    deleteLive,
    updateSelectedLive,
    showTipsModal,
    modifyParams,
    getTaUsers,
    updateAdmin,
    getAdminList,
    updateTausers,
    stopLive
  }
)(ActionBar);
