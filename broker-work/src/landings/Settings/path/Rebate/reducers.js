import { combineReducers } from 'redux';
import * as LevelReducer from './path/LevelSetting/controls/reducers';
import * as MultiAgentReducer from './path/MultiAgent/reducers';
import * as SymbolGroupSettingReducer from './path/SymbolGroupSetting/controls/reducers';
import * as DistributionRuleReducer from './path/Distribution/controls/reducers';
import * as RealTimeRebateReducer from './path/RealTimeRebate/controls/reducers';

export const level = combineReducers({ ...LevelReducer });
export const multiAgent = combineReducers({ ...MultiAgentReducer });
export const symbolGroup = combineReducers({ ...SymbolGroupSettingReducer });
export const distributionRule = combineReducers({ ...DistributionRuleReducer });
export const realTimeRebate = combineReducers({ ...RealTimeRebateReducer });
