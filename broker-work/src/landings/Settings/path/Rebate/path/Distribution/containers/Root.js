import { connect } from 'react-redux';
import DistributionRuleSetting from '../components/Root';
import { showTipsModal } from 'commonActions/actions';
import {
  getRuleList,
  selectRule,
  createRule,
  updateRule,
  removeRule,
  switchRuleType,
  getRuleDetail,
  updateRuleDetail,
  saveMinSeconds,
  getMinSeconds
} from '../controls/actions';
import {
  getDistributionBasicResource,
  getDistributionMode2BalanceType,
  checkRuleDetail
} from '../../../../../controls/actions';
import { changeRulePriority } from '../../MultiAgent/controls/actions';

import { getPVmapList } from '../../MultiAgent/path/TransactionRule/controls/actions';

export default connect(
  ({
    common: { brandInfo },
    settings: {
      rebate: {
        distributionRule,
        realTimeRebate: { realTimeStatus }
      },
      base: {
        group_list,
        account_list,
        server_group_list,
        balance_type,
        balance_unit,
        server_symbols,
        cycleLevelList,
        distributionCommissionTypeList,
        distributionPipCommissionTypeList
      }
    }
  }) => {
    return {
      groupList: group_list,
      accountList: account_list,
      serverGroupList: server_group_list,
      balanceType: balance_type,
      balanceUnit: balance_unit,
      serverSymbols: server_symbols,
      cycleLevelList,
      realTimeStatus,
      brandInfo,
      distributionCommissionTypeList,
      distributionPipCommissionTypeList,
      ruleList: distributionRule.rule_list,
      selectedRule: distributionRule.selected_rule,
      ruleDetail: distributionRule.rule_detail,
      minSeconds: distributionRule.minSeconds
    };
  },
  {
    getDistributionBasicResource,
    getDistributionMode2BalanceType,
    showTipsModal,
    getRuleList,
    getPVmapList,
    selectRule,
    createRule,
    updateRule,
    removeRule,
    getRuleDetail,
    switchRuleType,
    updateRuleDetail,
    checkRuleDetail,
    changeRulePriority,
    saveMinSeconds,
    getMinSeconds
  }
)(DistributionRuleSetting);
