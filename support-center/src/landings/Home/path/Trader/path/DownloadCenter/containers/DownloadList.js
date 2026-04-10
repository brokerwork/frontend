import { connect } from 'react-redux';
import DownloadList from '../components/DownloadList';
import {
  getDownloadList,
  operateDownloadItem,
  deleteDownloadItemByID,
  setEditTargetData
} from '../controls/actions';
import { showTopAlert, showTipsModal } from 'common/actions';

export default connect(({
  traderDownloadCenter: {downloadList}
}) => ({
  downloadList
}), {
  getDownloadList,
  operateDownloadItem,
  deleteDownloadItemByID,
  setEditTargetData,
  showTipsModal,
  showTopAlert
})(DownloadList);
