import { connect } from 'react-redux';
import TransactionRuleSetting from '../components/Root';
import { showTipsModal } from 'commonActions/actions';

import {
  getRuleList,
  selectRule,
  createRule,
  updateRule,
  removeRule,
  getPVmapList,
  createPVmap,
  updatePVmap,
  removePVmap,
  getRuleDetail,
  createRuleDetail,
  updateRuleDetail,
  removeRuleDetail
} from '../controls/actions';
import {
  getBasicResource,
  checkRuleDetail,
  checkParameter
} from '../../../../../../../controls/actions';
import { changeRulePriority } from '../../../controls/actions';

export default connect(
  ({
    common: { userRights, brandInfo },
    settings: {
      rebate: {
        multiAgent: { feeReturnsRule }
      },
      base: {
        group_list,
        account_list,
        server_group_list,
        balance_type,
        balance_unit,
        level_list,
        server_symbols,
        profitType
      }
    }
  }) => {
    return {
      userRights,
      brandInfo,
      groupList: group_list,
      accountList: account_list,
      serverGroupList: server_group_list,
      balanceType: balance_type,
      balanceUnit: balance_unit,
      levelList: level_list,
      serverSymbols: server_symbols,

      ruleList: feeReturnsRule.rule_list,
      ruleListTime: feeReturnsRule.rule_list_time,
      selectedRule: feeReturnsRule.selected_rule,
      pvmapList: feeReturnsRule.pvmap_list,
      ruleDetail: feeReturnsRule.rule_detail
    };
  },
  {
    getBasicResource,
    showTipsModal,
    getRuleList,
    selectRule,
    createRule,
    updateRule,
    removeRule,
    getPVmapList,
    createPVmap,
    updatePVmap,
    removePVmap,
    getRuleDetail,
    createRuleDetail,
    updateRuleDetail,
    removeRuleDetail,
    checkRuleDetail,
    checkParameter,
    changeRulePriority
  }
)(TransactionRuleSetting);
