import { connect } from 'react-redux';
import TransactionRuleSetting from '../components/Root';
import { showTipsModal, showTopAlert } from 'commonActions/actions';

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
  removeRuleDetail,
  saveMinSeconds,
  getMinSeconds
} from '../controls/actions';
import {
  getBasicResource,
  checkRuleDetail,
  checkParameter
} from '../../../../../../../controls/actions';
import { changeRulePriority } from '../../../controls/actions';

export default connect(
  ({
    common: { userRights, versionRights },
    settings: {
      rebate: {
        multiAgent: { transactionRule }
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
      versionRights,
      userRights,
      groupList: group_list,
      accountList: account_list,
      serverGroupList: server_group_list,
      balanceType: balance_type,
      balanceUnit: balance_unit,
      levelList: level_list,
      serverSymbols: server_symbols,
      minSeconds: transactionRule.minSeconds,
      ruleList: transactionRule.rule_list,
      selectedRule: transactionRule.selected_rule,
      pvmapList: transactionRule.pvmap_list,
      ruleDetail: transactionRule.rule_detail
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
    changeRulePriority,
    saveMinSeconds,
    getMinSeconds,
    showTopAlert
  }
)(TransactionRuleSetting);
