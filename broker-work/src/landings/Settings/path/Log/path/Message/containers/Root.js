import { connect } from 'react-redux';
import i18n from 'utils/i18n';

import {
  getLogData,
  modifyParams,
  getLogType,
  resetParams,
  resendEmail,
  getEmailList
} from '../../../controls/actions';

import { showTipsModal, showTopAlert } from 'commonActions/actions';

import Root from '../components/Root';

export default connect(
  ({ settings: { settingLog }, common: { userRights } }) => {
    return {
      userRights: userRights,
      data: settingLog.logs,
      params: settingLog.params,
      paginationInfo: settingLog.paginationInfo,
      logType: settingLog.logType,
      searchOptions: settingLog.searchOptions,
      emails: settingLog.emails,
      module: 'MESSAGE',
      title: i18n['settings.left_menu.log.sub_menu.message_log']
    };
  },
  {
    getLogData,
    modifyParams,
    getLogType,
    resetParams,
    resendEmail,
    showTipsModal,
    showTopAlert,
    getEmailList
  }
)(Root);
