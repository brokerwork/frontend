import { combineReducers } from 'redux';

// import * as statisticalReportReducers from './path/StatisticalReport/controls/reducers';
// import * as commissionReportReducers from './path/CommissionReport/controls/reducers';
// import * as outStandingReportReducers from './path/OutStandingReport/controls/reducers';
// import * as downloadCenterReducers from './path/DownloadCenter/controls/reducers';
// import * as retryDepositReducers from './path/RetryDepositReport/controls/reducers';
import * as baseReducers from './controls/reducers';
import * as agentDepositReducers from './path/MyDeposit/controls/reducers';
import * as securitySettingReducers from './path/SecuritySetting/controls/reducers';

// export const statisticalReport = combineReducers({
//   ...statisticalReportReducers
// });
// export const commissionReport = combineReducers({
//   ...commissionReportReducers
// });
// export const downloadCenter = combineReducers({ ...downloadCenterReducers });
// export const outStandingReport = combineReducers({
//   ...outStandingReportReducers
// });
// export const retryDeposit = combineReducers({ ...retryDepositReducers });
export const agentDepositReport = combineReducers({ ...agentDepositReducers });
export const securitySetting = combineReducers({ ...securitySettingReducers });
export const base = combineReducers({ ...baseReducers });
