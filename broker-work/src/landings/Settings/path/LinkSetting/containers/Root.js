import { connect } from 'react-redux';
import { showTipsModal, showTopAlert } from 'commonActions/actions';
import {
  getLinkList,
  getLinkType,
  removeLink,
  getServerList,
  updateCurrentPlatform,
  getLinkStatistic,
  clearLinkStatistic,
  getUserGroupList,
  getLeverageList,
  getQrcode,
  updateCurrentStatus,
  disabledLink,
  getEditLinkDetail
} from '../controls/actions';
import LinkSetting from '../components/Root';

export default connect(
  ({ settings: { link }, common }) => {
    return {
      linkList: link.linkList,
      typeList: link.typeList,
      currentPlatform: link.currentPlatform,
      linkStatistic: link.linkStatistic,
      brandInfo: common.brandInfo,
      serverList: link.serverList,
      leverageList: link.leverageList,
      userGroupList: link.userGroupList,
      currentQrcode: link.currentQrcode,
      currentStatus: link.currentStatus,
      currentEditLink: link.currentEditLink
    };
  },
  {
    showTopAlert,
    showTipsModal,
    getLinkList,
    getLinkType,
    removeLink,
    getServerList,
    updateCurrentPlatform,
    getLinkStatistic,
    clearLinkStatistic,
    getUserGroupList,
    getLeverageList,
    getQrcode,
    disabledLink,
    updateCurrentStatus,
    getEditLinkDetail
  }
)(LinkSetting);
