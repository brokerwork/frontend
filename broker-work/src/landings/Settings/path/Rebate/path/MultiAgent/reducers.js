import { combineReducers } from 'redux';
import * as transactionRuleReducers from './path/TransactionRule/controls/reducers';
import * as depositRuleReducers from './path/DepositRule/controls/reducers';
import * as profitRuleReducers from './path/ProfitRule/controls/reducers';
import * as RebateParamsReducers from './path/RebateParams/controls/reducers';
import * as feeReturnsRuleReducers from './path/FeeReturnsRule/controls/reducers';

export const transactionRule = combineReducers({ ...transactionRuleReducers });
export const depositRule = combineReducers({ ...depositRuleReducers });
export const profitRule = combineReducers({ ...profitRuleReducers });
export const rebateParams = combineReducers({ ...RebateParamsReducers });
export const feeReturnsRule = combineReducers({ ...feeReturnsRuleReducers });
