import { connect } from 'react-redux';
import i18n from 'utils/i18n';

import {
  getLogData,
  modifyParams,
  getLogType,
  resetParams
} from '../../../controls/actions';

import Root from '../../../components/Root';

export default connect(
  ({ settings: { settingLog } }) => {
    return {
      data: settingLog.logs,
      params: settingLog.params,
      paginationInfo: settingLog.paginationInfo,
      logType: settingLog.logType,
      module: 'ACCOUNT',
      title: i18n['settings.left_menu.log.sub_menu.account_log']
    };
  },
  {
    getLogData,
    modifyParams,
    getLogType,
    resetParams
  }
)(Root);
