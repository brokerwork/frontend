import { connect } from 'react-redux';
import ActionBar from '../components/ActionBar';

import {
  getVideo,
  modifySearchParams,
  getLecturers,
  getVideoRecords,
  getVideoRecordRecycle,
  saveUploadVideos,
  createRecords,
  updateSelectedVideo,
  deleteVideo
} from '../controls/actions';

import { showTopAlert, showTipsModal } from 'commonActions/actions';

export default connect(
  ({ runmgmt: { videoRecords } }) => {
    return {
      data: videoRecords.videos,
      searchParams: videoRecords.searchParams,
      lecturers: videoRecords.lecturers,
      videoRecords: videoRecords.videoRecords,
      videoRecycles: videoRecords.videoRecycles,
      currenVideos: videoRecords.currenVideos,
      selectedVideoIds: videoRecords.selectedVideoIds,
      selectedVideos: videoRecords.selectedVideos,
      tenantRights: videoRecords.tenantRights
    };
  },
  {
    getVideo,
    modifySearchParams,
    showTopAlert,
    getLecturers,
    getVideoRecords,
    getVideoRecordRecycle,
    saveUploadVideos,
    createRecords,
    updateSelectedVideo,
    deleteVideo,
    showTipsModal
  }
)(ActionBar);
