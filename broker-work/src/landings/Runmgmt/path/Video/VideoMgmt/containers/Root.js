import { connect } from 'react-redux';
import Root from '../components/Root';

import {
  getVideo,
  updateRecords,
  saveUploadVideos,
  updateSelectedVideo,
  modifySearchParams,
  getTenantRights
} from '../controls/actions';
import { showTopAlert } from 'commonActions/actions';

export default connect(
  ({ runmgmt: { videoRecords }, common: { brandInfo } }) => {
    return {
      data: videoRecords.videos,
      searchParams: videoRecords.searchParams,
      navigationInfo: videoRecords.navigationInfo,
      lecturers: videoRecords.lecturers,
      videoRecycles: videoRecords.videoRecycles,
      currenVideos: videoRecords.currenVideos,
      selectedVideoIds: videoRecords.selectedVideoIds,
      selectedVideos: videoRecords.selectedVideos,
      brandInfo,
      tenantRights: videoRecords.tenantRights
    };
  },
  {
    getVideo,
    updateRecords,
    saveUploadVideos,
    showTopAlert,
    updateSelectedVideo,
    modifySearchParams,
    getTenantRights
  }
)(Root);
