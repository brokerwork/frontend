import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getLives,
  getLiveDetail,
  getLecturers,
  updateLive,
  updateSelectedLive,
  modifySearchParams,
  stopLive,
  getTenantRights,
  deleteLive
} from '../controls/actions';
import { getTopRight, showTipsModal } from 'commonActions/actions';

export default connect(
  ({
    runmgmt: { videoLive },
    common: { brandInfo, topRights, userRights }
  }) => {
    return {
      data: videoLive.lives,
      searchParams: videoLive.searchParams,
      navigationInfo: videoLive.navigationInfo,
      lecturers: videoLive.lecturers,
      currentLive: videoLive.currentLive,
      listType: videoLive.listType,
      lecturersList: videoLive.lecturersList,
      lecturerNavigationInfo: videoLive.lecturerNavigationInfo,
      selectedLiveIds: videoLive.selectedLiveIds,
      selectedLives: videoLive.selectedLives,
      brandInfo,
      topRights,
      tenantRights: videoLive.tenantRights,
      userRights
    };
  },
  {
    getLives,
    getLiveDetail,
    updateLive,
    getLecturers,
    updateSelectedLive,
    modifySearchParams,
    getTopRight,
    stopLive,
    getTenantRights,
    showTipsModal,
    deleteLive
  }
)(Root);
