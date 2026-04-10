import { connect } from 'react-redux';
import UploadVideo from '../components/UploadVideo';
import { showTopAlert } from 'commonActions/actions';
import {
  saveUploadVideos,
  setFieldId,
  getSignature
} from '../controls/actions';

export default connect(
  ({ runmgmt: { videoRecords } }) => {
    return {
      currenVideos: videoRecords.currenVideos,
      videoRecycles: videoRecords.videoRecycles,
      currentSignature: videoRecords.currentSignature,
      tenantRights: videoRecords.tenantRights
    };
  },
  {
    saveUploadVideos,
    setFieldId,
    showTopAlert,
    getSignature
  }
)(UploadVideo);
