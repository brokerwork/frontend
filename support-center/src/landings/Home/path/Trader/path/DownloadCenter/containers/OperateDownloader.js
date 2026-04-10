import { connect } from 'react-redux';
import { submit, formValueSelector } from 'redux-form';
import OperateDownloader from '../components/OperateDownloader';
import { showTopAlert } from 'common/actions';
import { operateDownloadItem, getDownloadList, setEditTargetData } from '../controls/actions';
import { DOWNLOADER_FORM } from '../controls/actions';

const selector = formValueSelector(DOWNLOADER_FORM);

export default connect(
  ({ traderDownloadCenter: { editDownloaderTarget }, traderCommon: { brandInfo } }) => {
    return {
      editDownloaderTarget,
      brandInfo
      // emailFromName: selector(state, 'fromName')
    };
  },
  {
    submitForm: submit,
    getDownloadList,
    setEditTargetData,
    operateDownloadItem,
    getDownloadList,
    setEditTargetData,
    showTopAlert
  }
)(OperateDownloader);
