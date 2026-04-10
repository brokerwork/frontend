import { combineReducers } from 'redux';

import * as statisticalReportReducers from './path/StatisticalReport/controls/reducers';
import * as commissionReportReducers from './path/CommissionReport/controls/reducers';
import * as outStandingReportReducers from './path/OutStandingReport/controls/reducers';
import * as downloadCenterReducers from './path/DownloadCenter/controls/reducers';
import * as baseReducers from './controls/reducers';
import * as customReportEditorReducers from './path/CustomReportEditor/controls/reducers';
import * as customReportDetailReducers from './path/CustomReport/controls/reducers';
import * as userCustomReportDetailReducers from './path/UserCustomReport/controls/reducers';
// import * as agentDepositReducers from './path/AgentDepositReport/controls/reducers';
// import * as customerSigningPerformanceReducers from './path/CustomerSigningPerformanceReport/controls/reducers';

// import * as customerPaymentReducers from './path/CustomerPaymentReport/controls/reducers';
export const statisticalReport = combineReducers({
  ...statisticalReportReducers
});
export const commissionReport = combineReducers({
  ...commissionReportReducers
});
export const downloadCenter = combineReducers({
  ...downloadCenterReducers
});

export const outStandingReport = combineReducers({
  ...outStandingReportReducers
});

// export const agentDepositReport = combineReducers({ ...agentDepositReducers });
// export const customerSigningPerformanceReport = combineReducers({
//   ...customerSigningPerformanceReducers
// });
export const base = combineReducers({ ...baseReducers });
// export const customerPayment = combineReducers({ ...customerPaymentReducers });
export const customReportEditor = combineReducers({ ...customReportEditorReducers });
export const customReportDetail = combineReducers({ ...customReportDetailReducers });
export const userCustomReportDetail = combineReducers({ ...userCustomReportDetailReducers });
