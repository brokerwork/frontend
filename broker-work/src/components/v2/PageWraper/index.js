import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
  getUserInfo,
  getUnreadMessage,
  getUnreadModalMessage,
  getIntroduceLink,
  getCountry,
  getBanks,
  getLanguage,
  closeTipsModal,
  closeTopAlert,
  getBrandInfo,
  getPhoneCountryCode,
  getCurrentUserRight,
  getTopRight,
  markMessageAsRead,
  markModalMessageAsRead,
  setLanguageType,
  logout,
  closeBannerNotice,
  closeRealeseNotice,
  getSystemSettings,
  getPersonalRule,
  getGioData,
  getObjects,
  getCustomReportList,
  getAccountType,
  getCustomMenu,
  handleCustomMenu,
  getAccessConfig
} from 'commonActions/actions';
import PageWraper from './PageWraper';

export default connect(
  ({ common }) => {
    return {
      userInfo: common.userInfo,
      unreadMessage: common.unreadMessage,
      myIntroduceLink: common.myIntroduceLink,
      tipsModalData: common.tipsModalData,
      topAlertData: common.topAlertData,
      brandInfo: common.brandInfo,
      loading: common.loading,
      navigation: common.navigation,
      customNavigation: common.customNavigation,
      transparentMask: common.transparentMask,
      unreadModalMessage: common.unreadModalMessage,
      userRights: common.userRights,
      todoTasksCount: common.todoTasksCount,
      bannerNoticeData: common.bannerNoticeData,
      realeseNoticeData: common.realeseNoticeData,
      topRights: common.topRights,
      personalRules: common.personalRules,
      personalReportShow: common.personalReportShow,
      loginIpInfo: common.loginIpInfo,
      accessConfig: common.accessConfig,
      extraServiceData: common.extraServiceData
    };
  },
  dispatch => {
    return bindActionCreators(
      {
        getUserInfo,
        getUnreadMessage,
        getUnreadModalMessage,
        getCountry,
        getBanks,
        getIntroduceLink,
        closeTipsModal,
        closeTopAlert,
        getBrandInfo,
        dispatch,
        getPhoneCountryCode,
        getCurrentUserRight,
        getTopRight,
        markMessageAsRead,
        markModalMessageAsRead,
        getLanguage,
        setLanguageType,
        logout,
        closeBannerNotice,
        closeRealeseNotice,
        getGioData,
        getSystemSettings,
        getPersonalRule,
        getObjects,
        getCustomReportList,
        getAccountType,
        getCustomMenu,
        handleCustomMenu,
        getAccessConfig
      },
      dispatch
    );
  }
)(PageWraper);

export {
  LayoutContainer as Layout,
  LayoutSummary as Summary,
  LayoutSider as Sider,
  LayoutHeader as Header,
  LayoutFooter as Footer,
  LayoutContent as Content
} from './Layout';
